import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const highlights = [
  {
    title: 'Expert Deliberations',
    text: 'Insightful sessions led by seasoned faculty and oncology experts.'
  },
  {
    title: 'Panel Discussions and Debates',
    text: 'Focused exploration of contemporary controversies in oncology for postgraduates.'
  },
  {
    title: 'Hands-on Workshops',
    text: 'Skill-based training sessions designed for practical clinical exposure.'
  },
  {
    title: 'Oral and Poster Presentations',
    text: 'A platform for young researchers to share their work and receive valuable feedback.'
  },
  {
    title: 'Awards and Recognitions',
    text: 'Recognition for outstanding scientific contributions and emerging talent.'
  }
];

export default function Invitation() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
      <motion.section
        className="page-section"
        style={{ paddingBottom: 'clamp(60px, 8vw, 96px)' }}
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="section-card neon-outline" style={{ padding: 'clamp(22px, 4vw, 40px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{ margin: '0 0 12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Official Invitation
              </p>
              <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1.08, marginBottom: '14px' }}>
                YROC 2027 <span className="gradient-text">(Young Radiation Oncologists Conference)</span>
              </h1>
              <p style={{ margin: '0 0 10px', fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                January 22-24, 2027 | Bareilly, Uttar Pradesh, India
              </p>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Hosted by the Department of Radiation Oncology, SRMS Institute of Medical Sciences (SRMSIMS), Bareilly.
              </p>
            </div>
          </div>

          <div style={{ padding: '18px 20px', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '18px', marginBottom: '28px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em' }}>
              Quick Access
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              <Link to="/registration" className="glassy-cta">Register</Link>
              <Link to="/contact" className="glassy-cta">Contact</Link>
            </div>
          </div>

          <div className="invitation-layout">
            <div className="invitation-snapshot-card">
              <h2 style={{ marginBottom: '14px', color: 'var(--accent)', fontSize: '1.2rem' }}>Conference Snapshot</h2>
              <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>Dates:</strong> January 22-24, 2027</p>
              <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>Venue:</strong> SRMSIMS, Bareilly</p>
              <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>Theme:</strong> Cancer Care Continuum</p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>Audience:</strong> Oncologists, physicists, residents, researchers, and allied professionals</p>
            </div>

            <div className="invitation-writeup">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                The Department of Radiation Oncology, SRMS Institute of Medical Sciences (SRMSIMS), Bareilly, is honored and delighted to extend a warm invitation to you for YROC 2027, the Young Radiation Oncologists Conference, scheduled to be held from 22nd to 24th January 2027.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                YROC 2027 is envisioned as a premier academic congregation aimed at bringing together young radiation oncologists, seasoned experts, medical physicists, residents, researchers, and allied healthcare professionals from across the country and beyond. The conference seeks to create a vibrant and intellectually stimulating environment that fosters learning, innovation, mentorship, and collaboration in the ever-evolving field of Radiation Oncology.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '18px' }}>
                The scientific program has been thoughtfully curated to ensure a rich and engaging experience for all participants. Highlights of the conference include:
              </p>

              <div className="invitation-highlights-grid">
                {highlights.map((item) => (
                  <div key={item.title} className="invitation-highlight-bar">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                Beyond the academic sessions, YROC 2027 will also provide ample opportunities for networking, mentorship, and professional growth, helping participants build meaningful collaborations and lifelong connections within the oncology community.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                Bareilly, a city known for its cultural heritage and warm hospitality, will serve as an ideal host, ensuring a comfortable and enriching experience for all attendees.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>
                We cordially invite you to be a part of this exciting academic endeavor and contribute to shaping the future of Radiation Oncology. Your presence and participation will greatly enrich the scientific deliberations and success of the conference.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 0 }}>
                Further details regarding registration, abstract submission, accommodation, and the detailed scientific program will be announced shortly on our official conference website. We eagerly look forward to welcoming you to YROC 2027 at SRMSIMS, Bareilly.
              </p>

              <div className="invitation-signoff-grid" style={{ marginTop: '24px' }}>
                <div style={{ padding: '20px', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px', textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '6px', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>Dr Himanshi Khattar</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Organizing Secretary</p>
                </div>
                <div style={{ padding: '20px', background: 'var(--surface-glass)', border: '1px solid var(--surface-stroke)', borderRadius: '20px', textAlign: 'center' }}>
                  <h2 style={{ marginBottom: '6px', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>Dr Piyush Kumar</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Organizing Chairperson</p>
                </div>
              </div>
            </div>

            <div className="invitation-contact-card">
              <h2 style={{ marginBottom: '14px', color: 'var(--accent)', fontSize: '1.2rem' }}>Contact</h2>
              <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Dr Himanshi Khattar</p>
              <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}>(Organising Secretary)</p>
              <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)' }}>Phone Number: 7310604738</p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Email: To be updated</p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
