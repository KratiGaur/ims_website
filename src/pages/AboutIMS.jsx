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

export default function AboutIMS() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      
      <motion.section
        style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '40px', lineHeight: 1.1 }}>
          <span className="gradient-text">About IMS</span><br/>
          (International Medical Society)
        </motion.h1>
        
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
          The International Medical Society (IMS) was established in 1998 with a singular mission: to accelerate global collaboration among elite medical professionals, dedicated researchers, and forward-thinking policymakers. For over two decades, IMS has served as the indispensable nexus for sharing groundbreaking clinical research and standardizing world-class oncology care protocols across international borders.
        </p>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '40px' }}>
          We sponsor over 500 clinical trials annually and provide critical funding to emerging scientists making strides in immunotherapeutics and precision medicine. The YROC Cancer Conference is our flagship initiative, embodying our core philosophy that disease does not respect borders, and neither should scientific innovation.
        </p>
      </motion.section>

      <motion.section
        style={{ padding: 'clamp(24px, 4vw, 40px) 0' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--accent-primary)' }}>Awards & Recognitions</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ padding: 'clamp(18px, 3vw, 30px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Global Health Innovation Award (2025)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Awarded by the World Health Organization (WHO) for our unprecedented contribution to early diagnostic methodologies in underserved populations.</p>
          </div>

          <div style={{ padding: 'clamp(18px, 3vw, 30px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>The Vanguard Award for Oncology Excellence (2023)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Recognized for funding and organizing the largest multi-center trial for generic CAR-T cell manufacturing processes in developing nations.</p>
          </div>

          <div style={{ padding: 'clamp(18px, 3vw, 30px)', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Platinum Standard of Research Integrity (2020-2026)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Consistently recognized by the International Review Board for maintaining the highest ethical standards in all sponsored clinical investigations.</p>
          </div>
          
        </div>
      </motion.section>

    </motion.div>
  );
}
