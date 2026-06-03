import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -18, transition: { duration: 0.45, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: 'easeOut' }
  }
};

const bookFlipReveal = {
  hidden: {
    opacity: 0,
    rotateX: 18,
    rotateY: -10,
    translateY: 22,
    translateZ: 0,
    clipPath: 'inset(0 0 100% 0)',
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    translateY: 0,
    translateZ: 0,
    clipPath: 'inset(0 0 0 0)',
    filter: 'blur(0px)',
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  out: {
    opacity: 0,
    rotateX: -14,
    rotateY: 10,
    translateY: -10,
    clipPath: 'inset(100% 0 0 0)',
    filter: 'blur(6px)',
    transition: { duration: 0.55, ease: 'easeIn' }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.68, ease: 'easeOut' }
  }
};

const titleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.965,
    letterSpacing: '0.14em',
    textShadow: '0 0 0 rgba(124, 58, 237, 0)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    letterSpacing: '0em',
    textShadow: '0 0 26px rgba(124, 58, 237, 0.16)',
    transition: { duration: 0.85, ease: 'easeOut' }
  }
};

const gridReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: 'blur(5px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

const ambientOrbVariants = {
  floatA: {
    y: [0, -14, 0],
    x: [0, 10, 0],
    transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' }
  },
  floatB: {
    y: [0, 16, 0],
    x: [0, -12, 0],
    transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' }
  },
  floatC: {
    y: [0, -10, 0],
    x: [0, 8, 0],
    transition: { duration: 24, repeat: Infinity, ease: 'easeInOut' }
  }
};

const highlights = [
  {
    title: 'Expert Deliberations',
    text: 'Insightful sessions led by seasoned faculty and oncology experts.'
  },
  {
    title: 'Panel Discussions and Debates',
    text: 'Focused exploration of contemporary controversies in oncology for postgraduates.'
  },
  {
    title: 'Hands-on Workshops',
    text: 'Skill-based training sessions designed for practical clinical exposure.'
  },
  {
    title: 'Oral and Poster Presentations',
    text: 'A platform for young researchers to share their work and receive valuable feedback.'
  },
  {
    title: 'Awards and Recognitions',
    text: 'Recognition for outstanding scientific contributions and emerging talent.'
  }
];

export default function Invitation() {
  const shouldReduceMotion = useReducedMotion();
  const [envelopePhase, setEnvelopePhase] = useState('closed');
  const pulseTransition = shouldReduceMotion
    ? undefined
    : {
        duration: 0.9,
        repeat: Infinity,
        repeatDelay: 2.2,
        ease: 'easeInOut'
      };
  const isEnvelopeOpen = envelopePhase === 'open';

  // Book flipping page state
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalPages = 6;

  // Touch Swipe Gesture State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (envelopePhase !== 'opening') {
      return undefined;
    }

    const revealTimer = window.setTimeout(
      () => setEnvelopePhase('open'),
      shouldReduceMotion ? 350 : 1750
    );

    return () => window.clearTimeout(revealTimer);
  }, [envelopePhase, shouldReduceMotion]);

  const openEnvelope = () => {
    if (envelopePhase === 'closed') {
      setEnvelopePhase('opening');
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEnvelopeOpen) return;
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnvelopeOpen, currentPage]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;
    if (isSwipe) {
      if (distance > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const renderPageContent = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="invite-cover-layout">
            <span className="invite-cover-badge">Official Invitation</span>
            <div className="invite-cover-emblem">
              <Mail size={42} style={{ color: 'var(--accent)' }} />
            </div>
            <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', lineHeight: 1.1 }}>
              YROC 2027
            </h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '18px', fontWeight: 600 }}>
              Young Radiation Oncologists Conference
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 30px', maxWidth: '480px', lineHeight: 1.6 }}>
              Hosted by the Department of Radiation Oncology, SRMS Institute of Medical Sciences (SRMSIMS), Bareilly.
            </p>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '30px' }}>
              January 22-24, 2027 | Bareilly, Uttar Pradesh, India
            </div>
            <button 
              type="button" 
              className="invite-cta-btn invite-cta-primary" 
              onClick={(e) => { e.stopPropagation(); nextPage(); }}
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              Open Invitation →
            </button>
          </div>
        );
      case 1:
        return (
          <div className="invite-snapshot-grid">
            <div className="invite-snap-card">
              <h3>Dates</h3>
              <p>January 22-24, 2027</p>
            </div>
            <div className="invite-snap-card">
              <h3>Venue</h3>
              <p>SRMSIMS, Bareilly, Uttar Pradesh</p>
            </div>
            <div className="invite-snap-card">
              <h3>Theme</h3>
              <p>Cancer Care Continuum</p>
            </div>
            <div className="invite-snap-card">
              <h3>Audience</h3>
              <p>Oncologists, physicists, residents, researchers, and allied professionals</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="invite-message-layout">
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid rgba(168,85,247,0.15)', paddingBottom: '10px' }}>
              Warm Welcome
            </h2>
            <p>
              The Department of Radiation Oncology, SRMS Institute of Medical Sciences (SRMSIMS), Bareilly, is honored and delighted to extend a warm invitation to you for YROC 2027, the Young Radiation Oncologists Conference, scheduled to be held from 22nd to 24th January 2027.
            </p>
            <p>
              YROC 2027 is envisioned as a premier academic congregation aimed at bringing together young radiation oncologists, seasoned experts, medical physicists, residents, researchers, and allied healthcare professionals from across the country and beyond.
            </p>
            <p>
              The conference seeks to create a vibrant and intellectually stimulating environment that fosters learning, innovation, mentorship, and collaboration in the ever-evolving field of Radiation Oncology.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="invite-highlights-container">
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid rgba(168,85,247,0.15)', paddingBottom: '10px' }}>
              Scientific Highlights
            </h2>
            <div className="invite-highlight-row">
              <span className="invite-highlight-icon-num">01</span>
              <div className="invite-highlight-text">
                <h4>Expert Deliberations</h4>
                <p>Insightful sessions led by seasoned faculty and oncology experts.</p>
              </div>
            </div>
            <div className="invite-highlight-row">
              <span className="invite-highlight-icon-num">02</span>
              <div className="invite-highlight-text">
                <h4>Panel Discussions & Debates</h4>
                <p>Postgraduate-focused exploration of contemporary oncology controversies.</p>
              </div>
            </div>
            <div className="invite-highlight-row">
              <span className="invite-highlight-icon-num">03</span>
              <div className="invite-highlight-text">
                <h4>Hands-on Workshops</h4>
                <p>Skill-based training sessions designed for practical clinical exposure.</p>
              </div>
            </div>
            <div className="invite-highlight-row">
              <span className="invite-highlight-icon-num">04</span>
              <div className="invite-highlight-text">
                <h4>Oral & Poster Presentations</h4>
                <p>A premier platform for young researchers to share scientific work.</p>
              </div>
            </div>
            <div className="invite-highlight-row">
              <span className="invite-highlight-icon-num">05</span>
              <div className="invite-highlight-text">
                <h4>Awards & Recognition</h4>
                <p>Recognizing outstanding contributions and emerging talent.</p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="invite-committee-layout">
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid rgba(168,85,247,0.15)', paddingBottom: '10px' }}>
              Organizing Leadership
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 16px' }}>
              The dynamic team behind the conference orchestration, dedicated to creating an unforgettable academic experience.
            </p>
            <div className="invite-committee-grid">
              <div className="invite-member-card">
                <img src="/committee/HIMANSHI-KHATTAR.jpg" alt="Dr Himanshi Khattar" className="invite-member-photo" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                <h4>Dr Himanshi Khattar</h4>
                <p>Organizing Secretary</p>
              </div>
              <div className="invite-member-card">
                <img src="/committee/PIYUSH-KUMAR.jpg" alt="Dr Piyush Kumar" className="invite-member-photo" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                <h4>Dr Piyush Kumar</h4>
                <p>Organizing Chairperson</p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="invite-contact-layout">
            <div className="invite-contact-info-panel">
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '14px' }}>Contact Details</h2>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px', color: 'var(--text-primary)' }}>Dr Himanshi Khattar</h3>
              <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--accent)' }}>Organising Secretary</p>
              <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <strong>Phone:</strong> 7310604738
              </p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <strong>Email:</strong> To be updated
              </p>
            </div>
            <div className="invite-contact-actions">
              <Link to="/registration" className="invite-cta-btn invite-cta-primary">
                Register Now
              </Link>
              <Link to="/contact" className="invite-cta-btn invite-cta-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const flipAnimationVariants = {
    enter: (dir) => ({
      rotateY: dir > 0 ? 85 : -85,
      opacity: 0,
      z: -100
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      z: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    exit: (dir) => ({
      rotateY: dir > 0 ? -85 : 85,
      opacity: 0,
      z: -100,
      transition: { duration: 0.5, ease: 'easeIn' }
    })
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="content-shell medium-shell invitation-premium-shell"
    >
      <div className="invitation-atmosphere" aria-hidden="true">
        <motion.span
          className="invitation-atmosphere__orb invitation-atmosphere__orb--a"
          animate={shouldReduceMotion ? undefined : ambientOrbVariants.floatA}
        />
        <motion.span
          className="invitation-atmosphere__orb invitation-atmosphere__orb--b"
          animate={shouldReduceMotion ? undefined : ambientOrbVariants.floatB}
        />
        <motion.span
          className="invitation-atmosphere__orb invitation-atmosphere__orb--c"
          animate={shouldReduceMotion ? undefined : ambientOrbVariants.floatC}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          <motion.section
            key="invitation-envelope"
            className="invitation-sms-stage"
            variants={sectionReveal}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.35, ease: 'easeIn' } }}
          >
            <motion.button
              type="button"
              className={`invitation-sms-envelope invitation-sms-envelope--${envelopePhase}`}
              aria-label="Open the YROC 2027 invitation letter"
              onClick={openEnvelope}
              disabled={envelopePhase === 'opening'}
              whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <span className="invitation-sms-envelope__letter" aria-hidden="true">
                <span className="invitation-sms-envelope__letter-badge">13th</span>
                <span className="invitation-sms-envelope__letter-title">YROC 2027</span>
                <span className="invitation-sms-envelope__letter-subtitle">Invitation</span>
              </span>
              <span className="invitation-sms-envelope__flap" aria-hidden="true" />
              <span className="invitation-sms-envelope__front" aria-hidden="true" />
              <span className="invitation-sms-envelope__icon" aria-hidden="true">
                <Mail size={76} strokeWidth={1.8} />
              </span>
              <span className="invitation-sms-envelope__title">YROC Invitation</span>
              <span className="invitation-sms-envelope__prompt">
                {envelopePhase === 'opening' ? 'Opening letter' : 'Open letter'}
              </span>
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            key="invitation-letter"
            className="page-section invitation-page-section"
            style={{ paddingBottom: 'clamp(60px, 8vw, 96px)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
          >
            <div className="invite-book-container">
              <div 
                className="invite-book"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* 3D Spine details for physical book look */}
                <div className="invite-spine">
                  <span className="invite-spine-rivet" />
                  <span className="invite-spine-rivet" />
                  <span className="invite-spine-rivet" />
                  <span className="invite-spine-rivet" />
                  <span className="invite-spine-rivet" />
                </div>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={flipAnimationVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="invite-page"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Hotspot triggers on corner curves */}
                    {currentPage > 0 && (
                      <>
                        <div 
                          className="corner-hotspot corner-hotspot-left" 
                          onClick={(e) => { e.stopPropagation(); prevPage(); }} 
                          title="Previous Page"
                        />
                        <div className="corner-curl-left" />
                      </>
                    )}
                    {currentPage < totalPages - 1 && (
                      <>
                        <div 
                          className="corner-hotspot corner-hotspot-right" 
                          onClick={(e) => { e.stopPropagation(); nextPage(); }} 
                          title="Next Page"
                        />
                        <div className="corner-curl" />
                      </>
                    )}

                    {renderPageContent(currentPage)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* HUD / Page navigation controls */}
              <div className="invite-hud">
                <button
                  type="button"
                  className="invite-nav-btn"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  aria-label="Previous Page"
                >
                  ←
                </button>

                <div className="invite-progress-dots">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span
                      key={i}
                      className={`invite-progress-dot ${currentPage === i ? 'active' : ''}`}
                      onClick={() => {
                        setDirection(i > currentPage ? 1 : -1);
                        setCurrentPage(i);
                      }}
                      title={`Go to page ${i + 1}`}
                    />
                  ))}
                  <span className="invite-page-num" style={{ marginLeft: '12px' }}>
                    {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                  </span>
                </div>

                <button
                  type="button"
                  className="invite-nav-btn"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  aria-label="Next Page"
                >
                  →
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

