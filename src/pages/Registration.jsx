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

export default function Registration() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell narrow-shell">
      <motion.section
        className="page-section"
        style={{ textAlign: 'center', padding: '60px 0' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="page-title centered" style={{ marginBottom: '10px' }}>
          YROC2027 <span className="gradient-text">Registration</span>
        </h1>
        <p className="page-lead centered" style={{ marginBottom: '35px' }}>
          The YROC2027 registration page is currently being updated. Please check back soon for the full registration process.
        </p>

        <div
          style={{
            textAlign: 'left',
            margin: '0 auto',
            maxWidth: 860,
            padding: '30px 28px',
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-stroke)',
            borderRadius: 20,
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)'
          }}
        >
          <h2 style={{ margin: '0 0 16px', color: 'var(--accent-primary)', fontSize: '1.4rem' }}>
            Coming Soon
          </h2>
          <p style={{ margin: '0 0 18px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            We are refreshing the registration details and will publish the updated process shortly. Once the page is live, you will be able to submit your registration, review fees, and complete payment directly from here.
          </p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            If you have immediate questions, please reach out through the contact page or the conference email address.
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}

