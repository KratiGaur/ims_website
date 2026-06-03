import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play } from 'lucide-react';

export default function WelcomeSplash({ onComplete }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Attempt autoplay
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.log("Autoplay blocked or video missing, waiting for user click.", err);
          setIsPlaying(false);
        });
    }
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        filter: 'blur(8px)',
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="welcome-splash-overlay"
    >
      <video
        ref={videoRef}
        src="/intro_mascot.mp4"
        className="welcome-splash-video"
        autoPlay
        muted={isMuted}
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          setHasStarted(true);
        }}
        onEnded={onComplete}
        onError={() => setError(true)}
      />

      {/* Futuristic Grid Overlay & Scientific Color Gradient Mask */}
      <div className="welcome-splash-mask" />



      {/* Mute Control & Enter Button */}
      {hasStarted && !error && (
        <>
          <button 
            type="button" 
            className="welcome-splash-mute" 
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute intro video" : "Mute intro video"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button 
            type="button" 
            className="welcome-splash-enter-btn" 
            onClick={onComplete}
          >
            <span>ENTER SITE</span>
          </button>
        </>
      )}

      {/* Fallback Play Button if Autoplay is blocked */}
      {(!isPlaying || error) && (
        <div className="welcome-splash-fallback">
          <button 
            type="button" 
            className="welcome-splash-play-fallback-btn" 
            onClick={handlePlayClick}
          >
            <Play size={24} fill="currentColor" />
            <span>PLAY INTRO</span>
          </button>
          <button 
            type="button" 
            className="welcome-splash-skip-fallback-btn" 
            onClick={onComplete}
          >
            SKIP INTRO
          </button>
        </div>
      )}
    </motion.div>
  );
}
