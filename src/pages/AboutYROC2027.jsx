import React, { useMemo, useState } from 'react';
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

const events = [
  {
    id: '12th',
    label: '12th YROC (2026) - 24–25 Jan 2026',
    image: '/yroc_pastEvents/12thYroc.jpeg',
    title: '12th YROC 2025',
    body: `The 12th Young Radiation Oncologists Conference (YROC) was indeed held on 24th and 25th January 2026.\n\n• Venue: NIMHANS Convention Centre, Bengaluru, Karnataka.\n• Organizer: Department of Radiation Oncology, Kidwai Memorial Institute of Oncology.\n• Theme: "Radiate Knowledge, Transform Care"`
  },
  {
    id: '11th',
    label: '11th YROC (Madurai)',
    image: '/yroc_pastEvents/11thYroc.jpeg',
    title: '11th YROC 2025',
    body: `11th YROC 2025\n\n• Conducted in Madurai.\n• Theme: Challenges & Controversies in Clinical Oncology.\n• Sessions included stereotactic radiosurgery, brachytherapy, re-irradiation, debates, and practical oncology discussions`
  },
  {
    id: '10th',
    label: '10th YROC (Jodhpur)',
    image: '/yroc_pastEvents/10thYroc.jpeg',
    title: '10th YROC 2024',
    body: `10th YROC 2024\n\n• Organized at AIIMS Jodhpur.\n• Theme centered on Brachytherapy and SABR (Stereotactic Ablative Radiotherapy).\n• Included workshops, mentorship sessions, panel discussions, and scientific presentation`
  },
  {
    id: '9th',
    label: '9th YROC (2023)',
    image: '/yroc_pastEvents/9thYroc.jpeg',
    title: '9th YROC 2023',
    body: `9th YROC 2023\n\n• Focused on emerging innovations in oncology and radiation therapy.\n• Theme: Innovations in Oncology: Spanning New Horizon.\n• Emphasized technological advances, precision radiotherapy, and improved patient outcomes.\n• 25 FEB 2023 - 26 FEB 2023\n\nVENUE: Dr. Ram Manohar Lohia I.M.S, Lucknow 2023`
  },
  {
    id: '8th',
    label: '8th YROC (2020)',
    image: '/yroc_pastEvents/8thYroc.jpeg',
    title: '8th YROC',
    body: `8th YROC\n\nK.M.C.H., Coimbatore 2020\n17 - 19 Jan 2020\n\nTheme: Radiotherapy for the Decade Ahead: Prepare for inevitable`
  }
];

function formatBody(text) {
  // Convert bullet-like lines into a simple paragraph + list-like lines.
  // Keep newlines so the UI remains faithful to the provided write-up.
  const lines = text.split('\n').map((l) => l.trimEnd());
  return lines;
}

export default function AboutYROC2027() {
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? '12th');

  const activeEvent = useMemo(() => events.find((e) => e.id === activeEventId) ?? events[0], [activeEventId]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
      <motion.section
        className="page-section about-hero-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-card about-hero-card">
          <div className="about-hero-copy">
            <span className="about-kicker">About</span>
            <h1 className="page-title about-page-title">
              <span className="gradient-text">YROC Past Events</span>
            </h1>
            <p className="page-lead">
              Explore the highlights of past Young Radiation Oncologists Conferences. Select an edition to view its write-up and image.
            </p>
          </div>
          <div className="about-hero-stats">
            <div className="about-stat">
              <strong>{events.length}</strong>
              <span>Past Editions</span>
            </div>
            <div className="about-stat">
              <strong>Left • Write-up</strong>
              <span>Right • Image</span>
            </div>
            <div className="about-stat">
              <strong>YROC</strong>
              <span>Conference Legacy</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="page-section-tight"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="section-card" style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span className="about-kicker" style={{ marginBottom: 10, display: 'inline-flex' }}>
                Select Edition
              </span>
              <h2 style={{ marginTop: 0, marginBottom: 0, color: 'var(--accent-primary)' }}>{activeEvent?.title ?? 'YROC'}</h2>
            </div>

            <div style={{ minWidth: 260 }}>
              <label htmlFor="yroc-event-select" style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>
                Past Event
              </label>
              <select
                id="yroc-event-select"
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 16,
                  border: '1px solid var(--surface-stroke)',
                  background: 'rgba(248, 251, 255, 0.7)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="about-yroc-layout" style={{ marginTop: 22 }}>
            <div className="about-yroc-image" style={{ flex: '0 0 42%', minWidth: 280 }}>
              <div className="section-card" style={{ padding: 12, background: 'transparent', borderRadius: 22 }}>
                <img
                  src={activeEvent?.image}
                  alt={activeEvent?.title ?? 'YROC Past Event'}
                  className="about-yroc-img"
                  onError={(e) => {
                    e.currentTarget.src = '/hero.png';
                  }}
                />
              </div>
            </div>

            <div className="about-yroc-writeup" style={{ paddingRight: 16 }}>
              {formatBody(activeEvent?.body ?? '').map((line, idx) => {
                if (!line) return <div key={idx} style={{ height: 10 }} />;
                if (line.startsWith('•')) {
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 900, minWidth: 10 }}>{'•'}</span>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{line.replace(/^•\s*/, '')}</p>
                    </div>
                  );
                }
                return (
                  <p key={idx} style={{ margin: '0 0 12px', color: 'var(--text-secondary)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

