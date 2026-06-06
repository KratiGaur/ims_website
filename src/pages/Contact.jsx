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

export default function Contact() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell" style={{ textAlign: 'center' }}>
      
      <motion.section
        className="page-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="page-title centered" style={{ marginBottom: '30px' }}>
          Contact <span className="gradient-text">Us</span>
        </h1>
        <p className="page-lead centered" style={{ marginBottom: '50px' }}>
          Have questions about registration, abstract submission, or sponsorships? Our team is here to help.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Email:</span> <a href="mailto:info@yroc2026.org" style={{ color: 'var(--text-primary)' }}>info@yroc2026.org</a>
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Phone:</span> <span style={{ color: 'var(--text-primary)' }}>+1 (212) 555-YROC</span>
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Secretariat HQ:</span> <span style={{ color: 'var(--text-primary)' }}>100 Medical Plaza, Geneva, Switzerland</span>
          </div>
        </div>

        <div style={{ padding: 'clamp(20px, 4vw, 40px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Conference Brochure</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Download the official 13th YROC Conference Brochure for a complete daily itinerary, speaker bios, and venue maps.
          </p>
          <button style={{
            padding: '15px 40px',
            backgroundColor: 'var(--accent-primary)',
            border: 'none',
            borderRadius: '30px',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Download PDF Brochure
          </button>
        </div>
      </motion.section>

    </motion.div>
  );
}
