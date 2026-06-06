import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

export default function Accommodation() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
      <motion.section
        style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(28px, 5vw, 40px)', display: 'flex', justifyContent: 'center' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-card neon-outline" style={{ padding: 'clamp(30px, 6vw, 60px)', maxWidth: '760px', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <i className="fa-solid fa-hotel" style={{ fontSize: '4rem', color: '#06b6d4', filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))' }}></i>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '20px' }}>
            Accommodation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Information regarding lodging, partner hotels, tariffs, and booking details will be available shortly.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)'
          }}>
            <i className="fa-solid fa-clock text-cyan-400" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', color: '#06b6d4' }}></i>
            <span style={{ color: '#22d3ee', fontWeight: 600, fontSize: '1.1rem' }}>To be Updated soon</span>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
