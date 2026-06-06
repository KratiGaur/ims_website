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

const committeeHierarchy = [
  [{ name: 'Mr Dev Murti', role: 'Chief Patron', image: '/committee/chairman_dev_murti2.jpg' }],
  [
    { name: 'Mr Aditya Murti', role: 'Patron', image: '/committee/Aditya-murti-director.jpg' },
    { name: 'Dr M. S. Butola', role: 'Patron', image: '/committee/DR-MD-BUTOLA-PRINCIPAL.jpg' }
  ],
  [{ name: 'Dr Piyush Kumar', role: 'Organising Chairperson', image: '/committee/PIYUSH-KUMAR.jpg' }],
  [{ name: 'Dr Himanshi Khattar', role: 'Organising Secretary', image: '/committee/HIMANSHI-KHATTAR.jpg' }]
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

        {committeeHierarchy.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="committee-tier"
            data-count={row.length}
            style={{ marginBottom: rowIdx === committeeHierarchy.length - 1 ? 0 : '24px' }}
          >
            {row.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5, borderColor: 'rgba(188, 163, 213, 0.5)' }}
                className="committee-card cinematic-hover-card"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="committee-photo"
                />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{member.name}</h3>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 0 }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.section>
    </motion.div>
  );
}
