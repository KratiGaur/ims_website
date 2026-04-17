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

const committeeMembers = [
  { name: 'Dr. Sarah Jenkins', role: 'Conference Chair', inst: 'Harvard Medical School' },
  { name: 'Dr. Alistair Vance', role: 'Scientific Director', inst: 'Oxford Oncology Center' },
  { name: 'Prof. Mei Lin', role: 'Head of Immunotherapy Track', inst: 'Singapore General Hospital' },
  { name: 'Dr. Roberto Carlos', role: 'Head of Pediatric Oncology', inst: 'Hospital Sírio-Libanês' },
  { name: 'Dr. Amina Yusuf', role: 'Global Health Equity Lead', inst: 'African Cancer Institute' },
  { name: 'Dr. Kenji Sato', role: 'Precision Medicine Coordinator', inst: 'University of Tokyo' }
];

export default function Committee() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
      
      <motion.section
        style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '50px', textAlign: 'center' }}>
          Organizing <span className="gradient-text">Committee</span>
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'clamp(16px, 3vw, 30px)' }}>
          {committeeMembers.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5, borderColor: 'rgba(188, 163, 213, 0.5)' }}
              style={{ 
                padding: 'clamp(18px, 3vw, 30px)',
                background: 'var(--surface-glass)',
                border: '1px solid var(--surface-stroke)',
                borderRadius: '20px',
                transition: 'border-color 0.3s ease'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{member.name}</h3>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '15px' }}>{member.role}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{member.inst}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </motion.div>
  );
}
