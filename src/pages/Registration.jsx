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

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  background: 'var(--surface-glass)',
  border: '1px solid var(--surface-stroke)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontFamily: 'Inter',
  fontSize: '1rem',
  marginBottom: '20px',
  outline: 'none'
};

export default function Registration() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      
      <motion.section
        style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(28px, 5vw, 40px)', textAlign: 'center' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '20px' }}>
          Conference <span className="gradient-text">Registration</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Secure your spot at the 13th YROC Cancer Conference. Early bird registration closes soon.
        </p>

        <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Full Name</label>
          <input type="text" placeholder="Dr. Jane Doe" style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Institution / Hospital</label>
          <input type="text" placeholder="Johns Hopkins Medicine" style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Specialization</label>
          <input type="text" placeholder="E.g., Medical Oncology, Radiology..." style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Email Address</label>
          <input type="email" placeholder="jane@example.com" style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Registration Type</label>
          <select style={{...inputStyle, appearance: 'none', cursor: 'pointer', WebkitAppearance: 'none'}}>
            <option value="delegate" style={{color: '#000'}}>Delegate (Standard)</option>
            <option value="student" style={{color: '#000'}}>Student / Fellow (Discounted)</option>
            <option value="speaker" style={{color: '#000'}}>Invited Speaker</option>
          </select>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'var(--accent-secondary)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '20px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            Submit Registration
          </motion.button>
        </form>
      </motion.section>

    </motion.div>
  );
}
