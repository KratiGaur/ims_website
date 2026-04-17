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

export default function Abstract() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      
      <motion.section
        style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '40px' }}>
          Call for <span className="gradient-text">Abstracts</span>
        </h1>
        
        <div style={{ padding: 'clamp(18px, 3vw, 30px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--accent-primary)' }}>Important Dates</h2>
          <ul style={{ listStyleType: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>Portal Opens:</strong> October 1, 2025</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Submission Deadline:</strong> January 15, 2026</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Acceptance Notification:</strong> March 1, 2026</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Late-breaking Abstract Deadline:</strong> April 10, 2026</li>
          </ul>
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Submission Guidelines</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '20px' }}>
          The Scientific Committee invites authors to submit abstracts for original research, clinical trials, and critical case studies in the field of oncology. All submissions must be written in English and exceed no more than 350 words.
        </p>
        
        <ul style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}>Structure your abstract: Background, Methods, Results, and Conclusions.</li>
          <li style={{ marginBottom: '10px' }}>Do not include tables, graphs, or images in the primary abstract text submission.</li>
          <li style={{ marginBottom: '10px' }}>Ensure all co-authors have reviewed and approved the content prior to submission.</li>
        </ul>

        <button style={{
          padding: '15px 30px',
          backgroundColor: 'transparent',
          border: '1px solid var(--accent-primary)',
          color: 'var(--accent-primary)',
          borderRadius: '30px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Access Submission Portal
        </button>
      </motion.section>

    </motion.div>
  );
}
