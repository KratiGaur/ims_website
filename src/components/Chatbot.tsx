import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, ChevronRight, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { sendChatMessage } from '../services/dify';

// Types
export interface MascotResponse {
  sender: 'neo' | 'nyra';
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'neo' | 'nyra' | 'user';
  text: string;
  timestamp: Date;
}

// Helper to parse response with mascot routing
export function parseDifyResponse(response: string): MascotResponse[] {
  // Normalize bold/italic prefixes like **Neo:** or *Nyra:* to plain Neo: / Nyra:
  let cleaned = response
    .replace(/\*\*(Neo|Nyra):\*\*/gi, '$1:')
    .replace(/\*(Neo|Nyra):\*/gi, '$1:')
    .replace(/\*\*(Neo|Nyra)\*\*/gi, '$1:')
    .replace(/\*(Neo|Nyra)\*/gi, '$1:');

  const hasNeo = cleaned.includes("Neo:");
  const hasNyra = cleaned.includes("Nyra:");

  if (hasNeo && hasNyra) {
    // Both respond. Let's find each chunk.
    const regex = /(Neo:|Nyra:)([\s\S]*?)(?=(?:Neo:|Nyra:|$))/gi;
    const matches: MascotResponse[] = [];
    let match;
    while ((match = regex.exec(cleaned)) !== null) {
      const senderName = match[1].toLowerCase().replace(':', '').trim();
      const sender = senderName === 'nyra' ? 'nyra' : 'neo';
      const text = match[2].trim();
      if (text) {
        matches.push({ sender, text });
      }
    }
    if (matches.length > 0) {
      return matches;
    }
  }

  // Check if it starts with one of the prefixes
  if (/^Neo:/i.test(cleaned)) {
    return [{ sender: 'neo', text: cleaned.replace(/^Neo:/i, '').trim() }];
  } else if (/^Nyra:/i.test(cleaned)) {
    return [{ sender: 'nyra', text: cleaned.replace(/^Nyra:/i, '').trim() }];
  }

  // Fallback keyword routing
  const lowercase = cleaned.toLowerCase();
  const isTravelOrAccom =
    lowercase.includes('travel') ||
    lowercase.includes('accommodation') ||
    lowercase.includes('bareilly') ||
    lowercase.includes('hotel') ||
    lowercase.includes('transport') ||
    lowercase.includes('stay') ||
    lowercase.includes('venue') ||
    lowercase.includes('flight') ||
    lowercase.includes('train') ||
    lowercase.includes('map') ||
    lowercase.includes('location') ||
    lowercase.includes('taxi') ||
    lowercase.includes('cab');

  const sender = isTravelOrAccom ? 'nyra' : 'neo';
  return [{ sender, text: cleaned }];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'welcome' | 'chat'>('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const pendingQueryRef = useRef<string | null>(null);

  // Quick Action options
  const quickActions = [
    { label: 'Registration', query: 'Tell me about the YROC 2027 registration details, fees, and how to register.' },
    { label: 'Conference Schedule', query: 'What is the schedule for YROC 2027, including dates and sessions?' },
    { label: 'Speakers', query: 'Who are the keynote speakers and presenters for YROC 2027?' },
    { label: 'Venue Information', query: 'Where is YROC 2027 being held and what are the details about the venue?' },
    { label: 'Travel Assistance', query: 'How can I travel to Bareilly for YROC 2027? What are the transportation options?' },
    { label: 'Accommodation', query: 'What are the accommodation options, hotels, and staying facilities near the YROC 2027 venue?' }
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading, isOpen]);

  // Handle tooltip timing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const startConversation = () => {
    setStep('chat');
    // Pre-populate with welcome messages from both mascots if empty
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-neo',
          sender: 'neo',
          text: "Hello! I'm Neo, your guide for all things related to YROC 2027 registration, scientific schedule, speakers, and conference workshops. How can I assist you today?",
          timestamp: new Date()
        },
        {
          id: 'welcome-nyra',
          sender: 'nyra',
          text: "Hi! I'm Nyra, here to help you with travel planning, local accommodation in Bareilly, transport options, and making your visit comfortable. Let me know what you need!",
          timestamp: new Date()
        }
      ]);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setConversationId(undefined);
    setStep('welcome');
    setError(null);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    // Ref-based guard: prevents duplicate sends when React state hasn't flushed yet
    if (sendingRef.current) return;
    sendingRef.current = true;

    setError(null);
    const userMsgText = textToSend;
    setInputText('');

    // Add user message to log
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userMsgText,
        timestamp: new Date()
      }
    ]);

    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMsgText, conversationId);

      // Store conversation ID for maintaining context
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Parse the response for mascot routing
      const mascotReplies = parseDifyResponse(response.answer);

      // Add each parsed reply to the message log
      setMessages((prev) => [
        ...prev,
        ...mascotReplies.map((reply, idx) => ({
          id: `mascot-${Date.now()}-${idx}`,
          sender: reply.sender,
          text: reply.text,
          timestamp: new Date()
        }))
      ]);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (
  message.includes('RESOURCE_EXHAUSTED') ||
  message.includes('429') ||
  message.includes('quota')
) {
  setError(
    'Neo & Nyra are receiving many requests right now. Please try again in a minute.'
  );
} else {
  setError(
    "I'm having trouble connecting. Please check your connection and try again."
  );
}
    } finally {
      setIsLoading(false);
      sendingRef.current = false;
    }
  };

  // When step transitions to 'chat' and there is a pending quick-action query, fire it
  useEffect(() => {
    if (step === 'chat' && pendingQueryRef.current) {
      const query = pendingQueryRef.current;
      pendingQueryRef.current = null;
      handleSendMessage(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleQuickAction = (queryText: string) => {
    // Store query to send after the welcome messages render
    pendingQueryRef.current = queryText;
    // Ensure initial welcomes are in log before sending quick action
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-neo',
          sender: 'neo',
          text: "Hello! I'm Neo, your guide for all things related to YROC 2027 registration, scientific schedule, speakers, and conference workshops. How can I assist you today?",
          timestamp: new Date()
        },
        {
          id: 'welcome-nyra',
          sender: 'nyra',
          text: "Hi! I'm Nyra, here to help you with travel planning, local accommodation in Bareilly, transport options, and making your visit comfortable. Let me know what you need!",
          timestamp: new Date()
        }
      ]);
    }
    setStep('chat');
  };

  return (
    <>
      {/* 1. CHATBOT LAUNCHER */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9999]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="absolute right-0 bottom-20 mr-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg border border-purple-400/30 whitespace-nowrap z-50 pointer-events-none"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  Ask Neo & Nyra
                  <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-pink-600 rotate-45 border-r border-b border-purple-400/30"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Ring Animation wrapper */}
            <motion.div
              className="relative p-[3px] rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-xl cursor-pointer overflow-visible"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              animate={{
                boxShadow: [
                  '0 10px 25px -5px rgba(168, 85, 247, 0.4), 0 8px 10px -6px rgba(244, 114, 182, 0.4)',
                  '0 15px 35px -5px rgba(168, 85, 247, 0.6), 0 12px 16px -6px rgba(244, 114, 182, 0.6)',
                  '0 10px 25px -5px rgba(168, 85, 247, 0.4), 0 8px 10px -6px rgba(244, 114, 182, 0.4)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <div className="relative flex items-center justify-center w-16 h-16 bg-white dark:bg-purple-950/90 rounded-full overflow-hidden">
                <img
                  src="/neo.png"
                  alt="Neo Guide"
                  loading="lazy"
                  className="absolute left-1 w-10 h-10 object-contain hover:scale-110 transition-transform duration-200 z-10"
                />
                <img
                  src="/nyra.png"
                  alt="Nyra Guide"
                  loading="lazy"
                  className="absolute right-1 w-10 h-10 object-contain hover:scale-110 transition-transform duration-200"
                />
              </div>

              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-1.5 rounded-full border-2 border-white dark:border-purple-950 shadow-md">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHAT UI CONTAINER (DRAWER / OVERLAY) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[650px] z-[9999] flex flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-primary)]/95 md:rounded-3xl border border-[var(--surface-stroke)] shadow-[var(--shadow-soft)] overflow-hidden backdrop-blur-xl"
            initial={{ scale: 0.85, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 50 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-purple-500/10 rounded-full filter blur-[40px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/3 bg-pink-500/10 rounded-full filter blur-[40px] pointer-events-none z-0"></div>

            {/* HEADER */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-[var(--surface-stroke)] bg-white/40 dark:bg-purple-950/30 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                {step === 'chat' && (
                  <button
                    onClick={resetChat}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors"
                    title="Go back to guide info"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="flex -space-x-2">
                  <img
                    src="/neo.png"
                    alt="Neo Avatar"
                    loading="lazy"
                    className="w-9 h-9 rounded-full border border-purple-400 bg-white/80 object-contain z-10"
                  />
                  <img
                    src="/nyra.png"
                    alt="Nyra Avatar"
                    loading="lazy"
                    className="w-9 h-9 rounded-full border border-pink-400 bg-white/80 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">Neo & Nyra</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">Guides Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {step === 'chat' && (
                  <button
                    onClick={resetChat}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    title="Restart chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SCREEN 1: WELCOME SCREEN */}
            {step === 'welcome' && (
              <div className="flex-1 flex flex-col p-6 overflow-y-auto z-10 scrollbar-thin">
                <div className="text-center mb-6 mt-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                    Official AI Assistant
                  </span>
                  <h2 className="text-2xl font-black mt-3 mb-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
                    Meet Your YROC Guides
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">We're here to make your YROC 2027 experience seamless.</p>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div
                    className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-purple-950/20 border border-[var(--surface-stroke)] shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-purple-400/40 bg-purple-500/10 flex items-center justify-center p-1">
                        <img src="/neo.png" alt="Neo" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Neo • Conference Info</h4>
                      <p className="text-xs text-[var(--text-primary)] font-medium mt-1 leading-relaxed">
                        "Hello, I'm Neo. I can help with registration, schedules, workshops, speakers, scientific sessions, and conference information."
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-purple-950/20 border border-[var(--surface-stroke)] shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-pink-400/40 bg-pink-500/10 flex items-center justify-center p-1">
                        <img src="/nyra.png" alt="Nyra" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-wide">Nyra • Travel & Guidance</h4>
                      <p className="text-xs text-[var(--text-primary)] font-medium mt-1 leading-relaxed">
                        "Hi, I'm Nyra. I can assist with travel, accommodation, Bareilly, transportation, and attendee guidance."
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mb-3">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pl-1">Quick Actions</h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center justify-between px-3 py-2.5 text-left text-xs font-semibold rounded-xl bg-white/70 dark:bg-purple-950/40 border border-[var(--surface-stroke)] text-[var(--text-primary)] hover:border-purple-500/50 hover:bg-purple-500/5 dark:hover:bg-purple-500/10 transition-all duration-200 cursor-pointer shadow-sm group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-500/60 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                    </motion.button>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <motion.button
                    onClick={startConversation}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span>Start Conversation</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* SCREEN 2: CHAT SCREEN */}
            {step === 'chat' && (
              <>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin z-10" style={{ scrollBehavior: 'smooth' }}>
                  {messages.map((message) => {
                    const isUser = message.sender === 'user';
                    const isNeo = message.sender === 'neo';
                    const isNyra = message.sender === 'nyra';

                    return (
                      <motion.div
                        key={message.id}
                        className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {!isUser && (
                          <div className="flex-shrink-0 self-end mb-1">
                            <div
                              className={`w-8 h-8 rounded-full border flex items-center justify-center p-0.5 shadow-sm bg-white dark:bg-purple-900 ${
                                isNeo ? 'border-purple-300' : 'border-pink-300'
                              }`}
                            >
                              <img src={isNeo ? '/neo.png' : '/nyra.png'} alt={isNeo ? 'Neo' : 'Nyra'} loading="lazy" className="w-full h-full object-contain" />
                            </div>
                          </div>
                        )}

                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            isUser
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none border border-purple-500/10'
                              : 'bg-white/80 dark:bg-purple-950/40 border border-[var(--surface-stroke)] text-[var(--text-primary)] rounded-bl-none'
                          }`}
                        >
                          {!isUser && (
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                                isNeo ? 'text-purple-600 dark:text-purple-400' : 'text-pink-600 dark:text-pink-400'
                              }`}
                            >
                              {isNeo ? 'Neo' : 'Nyra'}
                            </span>
                          )}
                          <div className="whitespace-pre-line font-medium text-[13px]">{message.text}</div>
                          <span className={`text-[9px] block text-right mt-1.5 ${isUser ? 'text-purple-200' : 'text-[var(--text-secondary)]'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {isLoading && (
                    <motion.div className="flex gap-2.5 max-w-[85%] mr-auto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex-shrink-0 self-end mb-1">
                        <div className="w-8 h-8 rounded-full border border-purple-300 bg-white dark:bg-purple-900 flex items-center justify-center p-0.5 shadow-sm">
                          <img src="/neo.png" alt="Neo" className="w-full h-full object-contain animate-pulse" />
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-white/80 dark:bg-purple-950/40 border border-[var(--surface-stroke)] rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500/70 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-purple-600/70 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-pink-500/70 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold mx-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                      <div className="flex-1">{error}</div>
                      <button
                        onClick={() => handleSendMessage(messages[messages.length - 1]?.text || '')}
                        className="text-[10px] uppercase font-bold tracking-wider underline hover:no-underline cursor-pointer"
                      >
                        Retry
                      </button>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {messages.length === 2 && !isLoading && (
                  <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-none z-10">
                    {quickActions.slice(0, 3).map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSendMessage(action.query)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-all cursor-pointer"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-4 border-t border-[var(--surface-stroke)] bg-white/40 dark:bg-purple-950/20 backdrop-blur-md z-10 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                      placeholder="Type a message..."
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-10 text-xs font-medium bg-white/80 dark:bg-purple-950/60 border border-[var(--surface-stroke)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/70 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all disabled:opacity-50"
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={isLoading || !inputText.trim()}
                    className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-md hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

