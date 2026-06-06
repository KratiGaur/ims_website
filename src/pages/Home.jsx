import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import BareillyAttractionCard from '../components/BareillyAttractionCard';
import CinematicBackdrop from '../components/CinematicBackdrop';
import { bareillyAttractions } from '../data/bareillyAttractions';
import YrocLegacyUniverse from '../components/YrocLegacyUniverse';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const textFade = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: 'easeOut' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 46, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
};

const vibeTags = ['Cancer Care Continuum', 'Radiation Oncology', 'Precision Care', 'Young Oncology Forum'];
const missionModules = [
  { label: 'Conference Dates', value: '15-17 October 2027', icon: 'fa-solid fa-calendar-days', status: 'Confirmed' },
  { label: 'Venue', value: 'SRMS Bareilly', icon: 'fa-solid fa-location-dot', status: 'Host Ready' },
  { label: 'Registration Status', value: 'Registration Open', icon: 'fa-solid fa-user-check', status: 'Live' },
  { label: 'Abstract Submission', value: 'Abstract Submission Open', icon: 'fa-solid fa-file-lines', status: 'Live' },
  { label: 'Speaker Announcements', value: 'To Be Announced', icon: 'fa-solid fa-microphone-lines', status: 'Standby' },
  { label: 'Accommodation', value: 'Delegate Desk Active', icon: 'fa-solid fa-hotel', status: 'Planning' }
];
const eventDate = new Date('2027-10-15T09:00:00');
const marqueeAttractions = [...bareillyAttractions, ...bareillyAttractions];

function getCountdownParts(targetDate) {
  const difference = targetDate.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => getCountdownParts(eventDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getCountdownParts(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell home-page cinematic-page">
      <CinematicBackdrop />

      <section className="hero-stage">
        <motion.div variants={textFade} initial="hidden" animate="visible" className="hero-glass-panel" style={{ gap: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.h1
            variants={textFade}
            initial="hidden"
            animate="visible"
            style={{ fontSize: 'clamp(5.5rem, 14vw, 10rem)', lineHeight: 0.9, fontWeight: 800, color: '#391a56', margin: 0 }}
          >
            YROC
          </motion.h1>

          <motion.p 
            variants={textFade} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.15 }}
            style={{ color: '#7c3aed', fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0, fontWeight: 700 }}
          >
            THEME: CANCER CARE CONTINUUM
          </motion.p>
          
          <motion.p
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            style={{ margin: 0, color: '#7c3aed', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 600, letterSpacing: '0.5px' }}
          >
            Preventive. Personalized. Precision. Palliative.
          </motion.p>

          <motion.p
            variants={textFade}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            style={{ margin: '0 auto', lineHeight: 1.8, color: '#6b7280', maxWidth: '680px', fontSize: '1.05rem' }}
          >
            YROC 2027 connects learning, technology, and compassion across every stage of cancer care.
          </motion.p>
        </motion.div>
      </section>

      <motion.section
        className="mission-yroc-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mission-command-shell">
          <div className="mission-header">
            <span className="about-kicker">Mission YROC'27</span>
            <h2>YROC'27 Countdown</h2>
            <p>Live mission control for the 2027 oncology conference countdown, delegate readiness, and announcement status.</p>
          </div>

          <div className="mission-dashboard">
            <div className="mission-center">
              <div className="mission-pulse-ring" />
              <h3>YROC'27</h3>
              <span>Countdown</span>
            </div>

            <div className="countdown-grid mission-countdown-grid">
              {[
                ['Days', timeLeft.days, 365],
                ['Hours', timeLeft.hours, 24],
                ['Minutes', timeLeft.minutes, 60],
                ['Seconds', timeLeft.seconds, 60]
              ].map(([label, value, max]) => (
                <motion.div key={label} whileHover={{ y: -8, scale: 1.02 }} className="count-pill mission-count-pill">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="50" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      pathLength="1"
                      initial={false}
                      animate={{ pathLength: Math.max(0.08, Math.min(Number(value) / Number(max), 1)) }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <motion.strong key={value} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    {String(value).padStart(label === 'Days' ? 3 : 2, '0')}
                  </motion.strong>
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </div>


        </div>
      </motion.section>

      <YrocLegacyUniverse />






    </motion.div>
  );
}
