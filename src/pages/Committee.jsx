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
  [{ name: 'Mr. Dev Murti', role: 'Chief Patron', image: '/committee/chairman_dev_murti2.jpg' }],
  [
    { name: 'Mr. Aditya Murti', role: 'Patron', image: '/committee/Aditya-murti-director.jpg' },
    { name: 'Dr. M. S. Butola', role: 'Patron', image: '/committee/DR-MD-BUTOLA-PRINCIPAL.jpg' }
  ],
  [{ name: 'Dr. Piyush Kumar', role: 'Organising Chairperson', image: '/committee/PIYUSH-KUMAR.jpg' }],
  [{ name: 'Dr. Himanshi Khattar', role: 'Organising Secretary', image: '/committee/Organizing Secretary.jpeg' }]
];

const nationalExecRows = [
  // Row 1: Dr. Manoj Gupta 
  [
    { name: 'Dr. Manoj Gupta', role: 'Chair AROI', image: '/committee/Chair AROI.jpeg' },
  ],

  // Row 2: Surendra Nath Senapati + C.S. Madhu
  [
    { name: 'Dr. Surendra Nath Senapati', role: 'President AROI', image: '/committee/President AROI.jpeg' },
    { name: 'Dr. C.S. Madhu', role: 'President Elect', image: '/committee/President Elect.jpeg' },
  ],

  // Row 3: Umesh Mahanshetty + Vikas Jagtap + V. Srinivasan (single row of three)
  [
    { name: 'Dr. Umesh Mahanshetty', role: 'Vice President (Sr.)', image: '/committee/Vice President (Sr.).jpeg' },
    { name: 'Dr. Vikas Jagtap', role: 'Vice President (Jr.) & YROC Coordinator', image: '/committee/Vice President (Jr.)& YROC Cordinator.jpeg' },
    { name: 'Dr. V. Srinivasan', role: 'Secretary General AROI', image: '/committee/Secretary General AROI.jpeg' },
  ],

  // Row 4: Sarbani Ghosh Lashkar + Gautam K Sharan + Pooja Nandwani Patel
  [
    { name: 'Dr. Sarbani Ghosh Lashkar', role: 'ICRO', image: '/committee/ICRO.jpeg' },
    { name: 'Dr. Gautam K Sharan', role: 'Vice chairman ICRO', image: '/committee/Vice chairman ICRO.jpeg' },
    { name: 'Dr. Pooja Nandwani Patel', role: 'Secretary ICRO', image: '/committee/Secretary ICRO.jpeg' },
  ],

  // Row 5: Dr. Bharti Devnani
  [
    { name: 'Dr. Bharti Devnani', role: 'YROC Convener', image: '/committee/YROC Convener.jpeg' },
  ],
];


const stateExecutiveRows = [
  [
    { name: 'Dr. Sonia Tiwari', role: 'UP Chapter President', image: '/committee/UP Chapter President .jpeg' },
    { name: 'Dr. Md Shadab Alam', role: 'UP chapter Secretary', image: '/committee/UP chapter  Secretary.jpeg' },
  ],
];



export default function Committee() {

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
      {/* National Committee */}

      <motion.section
        style={{ padding: 'clamp(28px, 5vw, 60px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', marginBottom: '50px', textAlign: 'center' }}>
          National Executive <span className="gradient-text">Committee</span>
        </h2>


        {nationalExecRows.map((row, rowIdx) => (
          <div
            key={`nat-${rowIdx}`}
            className="committee-tier"
            data-count={row.length}
            style={{ marginBottom: rowIdx === nationalExecRows.length - 1 ? 0 : '24px' }}
          >
            {row.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5, borderColor: 'rgba(188, 163, 213, 0.5)' }}
                className="committee-card"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="committee-photo"
                />
                <h3 className="committee-card__title">{member.name}</h3>
                <p className="committee-card__role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.section>

      {/* State Executive Committee */}
      <motion.section
        style={{ padding: 'clamp(28px, 5vw, 60px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', marginBottom: '50px', textAlign: 'center' }}>
          State Executive <span className="gradient-text">Committee</span>
        </h2>

        {stateExecutiveRows.map((row, rowIdx) => (
          <div
            key={`sec-${rowIdx}`}
            className="committee-tier"
            data-count={row.length}
            style={{ marginBottom: rowIdx === stateExecutiveRows.length - 1 ? 0 : '24px' }}
          >
            {row.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5, borderColor: 'rgba(188, 163, 213, 0.5)' }}
                className="committee-card"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="committee-photo"
                />
                <h3 className="committee-card__title">{member.name}</h3>
                <p className="committee-card__role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.section>

      {/* Organizing Committee */}
      <motion.section
        style={{ padding: 'clamp(28px, 5vw, 60px) 0 clamp(28px, 5vw, 40px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', marginBottom: '50px', textAlign: 'center' }}>
          Organizing <span className="gradient-text">Committee</span>
        </h2>

        {committeeHierarchy.map((row, rowIdx) => (
          <div
            key={`org-${rowIdx}`}
            className="committee-tier"
            data-count={row.length}
            style={{ marginBottom: rowIdx === committeeHierarchy.length - 1 ? 0 : '24px' }}
          >
            {row.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5, borderColor: 'rgba(188, 163, 213, 0.5)' }}
                className="committee-card"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="committee-photo"
                />
                <h3 className="committee-card__title">{member.name}</h3>
                <p className="committee-card__role">{member.role}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </motion.section>
    </motion.div>
  );
}

