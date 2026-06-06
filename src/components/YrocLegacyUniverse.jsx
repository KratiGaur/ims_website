import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bareillyAttractions } from '../data/bareillyAttractions';

const yrocEditions = [
  {
    year: "YROC'20",
    theme: 'Radiotherapy for the Decade Ahead',
    date: '17-19 January 2020',
    venue: 'KMCH, Coimbatore',
    speakers: 'Young faculty, senior mentors, physicists',
    image: 'https://images.unsplash.com/photo-1581093458791-9d09d42f3a39?auto=format&fit=crop&w=900&q=80',
    highlights: ['Future-ready radiotherapy practice', 'Hands-on treatment planning dialogues', 'Mentorship-led case learning'],
    stats: ['3 Days', '4 Tracks', '28 Sessions'],
    achievements: 'Set a strong benchmark for practical learning and cross-city young oncologist collaboration.'
  },
  {
    year: "YROC'21",
    theme: 'Resilient Oncology Learning',
    date: '2021 Edition',
    venue: 'Hybrid academic forum',
    speakers: 'National oncology educators and trainees',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80',
    highlights: ['Adaptive academic formats', 'Remote tumor board exchange', 'Evidence-first learning modules'],
    stats: ['Hybrid', 'Live Panels', 'Case Labs'],
    achievements: 'Kept peer learning active through a difficult period for healthcare systems.'
  },
  {
    year: "YROC'22",
    theme: 'Multidisciplinary Cancer Care',
    date: '2022 Edition',
    venue: 'Academic oncology network',
    speakers: 'Radiation, surgical, and medical oncology faculty',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=900&q=80',
    highlights: ['Integrated tumor boards', 'Site-specific debates', 'Resident research showcases'],
    stats: ['5 Boards', '40 Cases', 'Peer Review'],
    achievements: 'Expanded YROC from specialty learning into multidisciplinary cancer-care thinking.'
  },
  {
    year: "YROC'23",
    theme: 'Innovations in Oncology',
    date: '25-26 February 2023',
    venue: 'Dr. RML IMS, Lucknow',
    speakers: 'Technology leaders and clinical experts',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80',
    highlights: ['Precision radiotherapy updates', 'Technology-enabled care', 'Scientific paper presentations'],
    stats: ['2 Days', 'Innovation Forum', 'Poster Walk'],
    achievements: 'Focused the community on new horizons in radiation oncology and patient outcomes.'
  },
  {
    year: "YROC'24",
    theme: 'Precision Oncology',
    date: '2024 Edition',
    venue: 'AIIMS Jodhpur',
    speakers: 'Brachytherapy and SABR experts',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80',
    highlights: ['Brachytherapy workshops', 'SABR planning sessions', 'Mentorship discussions'],
    stats: ['Workshops', 'Panels', 'Mentorship'],
    achievements: 'Deepened technical skill-building around high-precision treatment.'
  },
  {
    year: "YROC'25",
    theme: 'Challenges and Controversies',
    date: '2025 Edition',
    venue: 'Madurai',
    speakers: 'Clinical debate faculty and young researchers',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80',
    highlights: ['Debates in clinical oncology', 'Re-irradiation discussions', 'SRS and brachytherapy sessions'],
    stats: ['Debates', 'Case Rounds', 'Clinical Pearls'],
    achievements: 'Created a sharp, debate-led forum for complex real-world decision-making.'
  },
  {
    year: "YROC'26",
    theme: 'Radiate Knowledge, Transform Care',
    date: '24-25 January 2026',
    venue: 'NIMHANS Convention Centre, Bengaluru',
    speakers: 'Kidwai Memorial Institute of Oncology and invited faculty',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=900&q=80',
    highlights: ['Transformative care models', 'Resident-focused academics', 'Collaborative scientific sessions'],
    stats: ['2 Days', 'Bengaluru', 'National Faculty'],
    achievements: 'Carried the YROC legacy into a polished national conference format before Bareilly 2027.'
  }
];

const bareillyShowcase = [
  {
    title: 'SRMS Campus',
    label: 'Host Institution',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1100&q=80',
    text: 'A medical academic campus designed for clinical learning, conference exchange, and delegate movement.'
  },
  {
    title: 'Conference Venue',
    label: 'Scientific Sessions',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1100&q=80',
    text: 'Auditorium-led sessions, workshops, tumor boards, and poster interactions in a single campus ecosystem.'
  },
  {
    title: 'Accommodation',
    label: 'Delegate Stay',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=80',
    text: 'Curated hotel and guest-house guidance for faculty, residents, and visiting delegates.'
  },
  {
    title: 'Travel Information',
    label: 'Arrival Desk',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1100&q=80',
    text: 'Bareilly connects through air, rail, and road with planned arrival support for YROC delegates.'
  },
  {
    title: 'Local Culture',
    label: 'Bareilly Identity',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1100&q=80',
    text: 'Heritage, food, city traditions, and local hospitality create a warmer conference destination.'
  }
];

const mapPoints = [
  { label: 'SRMS IMS Venue', x: 52, y: 48 },
  { label: 'Nearby Hotels', x: 35, y: 38 },
  { label: 'Bareilly Airport', x: 72, y: 26 },
  { label: 'Railway Station', x: 42, y: 70 },
  { label: 'City Attractions', x: 66, y: 64 }
];

export default function YrocLegacyUniverse() {
  const navigate = useNavigate();
  const [view, setView] = useState('orbit');
  const [selectedEdition, setSelectedEdition] = useState(() => yrocEditions[4]);
  const [activeCity, setActiveCity] = useState(0);

  const orbitNodes = useMemo(() => {
    return yrocEditions.map((edition, index) => {
      const angle = (index * 2 * Math.PI) / yrocEditions.length - Math.PI / 2;
      return {
        ...edition,
        angleDeg: (angle * 180) / Math.PI
      };
    });
  }, []);

  return (
    <section className={`orbit-universe-section yroc-legacy-world ${view === 'bareilly' ? 'is-expanded' : ''}`}>
      <div className="legacy-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ '--i': index }} />
        ))}
      </div>

      <div className="content-shell legacy-intro">
        <span className="about-kicker">Cancer Care Continuum</span>
        <h2>YROC Legacy <span className="gradient-text">Universe</span></h2>
        <p className="page-lead centered">
          Explore previous YROC editions orbiting around Bareilly 2027, then enter the host-city experience for venue, travel, culture, and delegate planning.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {view === 'orbit' ? (
          <motion.div
            key="legacy-orbit"
            className="galaxy-viewport legacy-galaxy-viewport"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="legacy-orbit-stage">
              <div className={`orbit-galaxy legacy-orbit-galaxy ${selectedEdition ? 'focused' : ''}`}>
                <svg className="network-grid-svg legacy-orbit-svg" viewBox="0 0 820 820" aria-hidden="true">
                  <defs>
                    <linearGradient id="legacyRing" x1="0" x2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                      <stop offset="52%" stopColor="#f7c7ff" stopOpacity="0.74" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.22" />
                    </linearGradient>
                  </defs>
                  <circle cx="410" cy="410" r="330" className="legacy-ring primary" />
                  <circle cx="410" cy="410" r="255" className="legacy-ring secondary" />
                  <circle cx="410" cy="410" r="185" className="legacy-ring tertiary" />
                  <path d="M34 620 C96 552, 142 700, 210 632 S320 548, 376 632" className="dna-path legacy-dna" />
                  {orbitNodes.map((node) => (
                    <line
                      key={node.year}
                      x1="410"
                      y1="410"
                      x2={410 + Math.cos((node.angleDeg * Math.PI) / 180) * 330}
                      y2={410 + Math.sin((node.angleDeg * Math.PI) / 180) * 330}
                      className="legacy-connector"
                    />
                  ))}
                </svg>

                <div className="rotator-continuum legacy-rotator">
                  {orbitNodes.map((edition) => (
                    <button
                      type="button"
                      key={edition.year}
                      className={`legacy-edition-node ${selectedEdition?.year === edition.year ? 'active' : ''}`}
                      style={{ '--angle': `${edition.angleDeg}deg` }}
                      onClick={() => setSelectedEdition(edition)}
                    >
                      <span className="legacy-node-face">
                        <span className="legacy-thumb"><img src={edition.image} alt={`${edition.year} conference`} /></span>
                        <strong>{edition.year}</strong>
                        <small>{edition.theme}</small>
                      </span>
                    </button>
                  ))}
                </div>

                <motion.button
                  type="button"
                  className="center-circle crystal-sphere-medical legacy-center-sphere"
                  onClick={() => navigate('/about/bareilly')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="sphere-glint" />
                  <h2>YROC'27</h2>
                  <p className="sphere-location">BAREILLY</p>
                  <span className="sphere-theme">Cancer Care Continuum</span>
                  <div className="discover-badge-medical">DISCOVER BAREILLY <i className="fa-solid fa-arrow-right" /></div>
                </motion.button>
              </div>

              <AnimatePresence>
                {selectedEdition && (
                  <motion.aside
                    className="legacy-side-panel"
                    initial={{ opacity: 0, x: 28, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 22, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button className="panel-close-btn" onClick={() => setSelectedEdition(null)} aria-label="Close edition details">
                      <i className="fa-solid fa-xmark" />
                    </button>
                    <h3>{selectedEdition.year}</h3>
                    <h4>{selectedEdition.theme}</h4>
                    <div className="legacy-side-meta">
                      <span><i className="fa-solid fa-location-dot" /> {selectedEdition.venue}</span>
                      <span><i className="fa-regular fa-calendar" /> {selectedEdition.date}</span>
                    </div>
                    <img src={selectedEdition.image} alt={`${selectedEdition.year} ${selectedEdition.theme}`} />
                    <h5>About {selectedEdition.year}</h5>
                    <p>{selectedEdition.achievements}</p>
                    <div className="legacy-side-stats">
                      {selectedEdition.stats.map((stat) => <span key={stat}>{stat}</span>)}
                    </div>
                    <h5>Highlights</h5>
                    <ul>
                      {selectedEdition.highlights.map((highlight) => (
                        <li key={highlight}><i className="fa-solid fa-circle-check" /> {highlight}</li>
                      ))}
                    </ul>
                    <button type="button" className="legacy-gallery-button">
                      View Gallery <i className="fa-regular fa-images" />
                    </button>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="bareilly-showcase"
            className="bareilly-showcase-dashboard legacy-bareilly-experience"
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="back-to-galaxy-btn" onClick={() => setView('orbit')}>
              <i className="fa-solid fa-arrow-left" /> Back to Legacy Universe
            </button>

            <div className="bareilly-hero-panel">
              <div>
                <span className="about-kicker">Welcome to Bareilly</span>
                <h2>The Host City of YROC 2027</h2>
                <p>Campus, venue, stay, movement, attractions, culture, and food highlights brought together as a delegate-first city guide.</p>
              </div>
              <img src={bareillyShowcase[activeCity].image} alt={bareillyShowcase[activeCity].title} />
            </div>

            <div className="bareilly-experience-grid">
              {bareillyShowcase.map((item, index) => (
                <motion.button
                  type="button"
                  key={item.title}
                  className={`bareilly-experience-card ${activeCity === index ? 'active' : ''}`}
                  onClick={() => setActiveCity(index)}
                  whileHover={{ y: -6 }}
                >
                  <img src={item.image} alt="" />
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.button>
              ))}
            </div>

            <div className="legacy-map-panel">
              <div>
                <span className="about-kicker">Interactive Map</span>
                <h3>Bareilly Delegate Navigation</h3>
                <p>Key arrival and stay points arranged as glass markers around the conference venue.</p>
              </div>
              <div className="legacy-map-canvas">
                {mapPoints.map((point) => (
                  <span key={point.label} className="legacy-map-marker" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                    <i className="fa-solid fa-location-dot" />
                    <em>{point.label}</em>
                  </span>
                ))}
              </div>
            </div>

            <div className="experience-carousel-container">
              <div className="experience-carousel">
                {bareillyAttractions.slice(0, 6).map((attraction) => (
                  <div key={attraction.id} className="experience-carousel-card">
                    <div className="experience-card-img-shell">
                      <img src={attraction.image} alt={attraction.title} className="experience-card-img" loading="lazy" />
                      <span className="experience-card-badge">{attraction.label}</span>
                    </div>
                    <div className="experience-card-body">
                      <h4 className="experience-card-title">{attraction.title}</h4>
                      <p className="experience-card-desc">{attraction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {false && selectedEdition && (
          <motion.div
            className="timeline-modal-overlay legacy-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEdition(null)}
          >
            <motion.article
              className="continuum-detail-panel legacy-edition-panel"
              initial={{ opacity: 0, y: 34, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: 'spring', damping: 24, stiffness: 210 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="legacy-panel-hero">
                <img src={selectedEdition.image} alt={`${selectedEdition.year} ${selectedEdition.theme}`} />
                <button className="panel-close-btn" onClick={() => setSelectedEdition(null)} aria-label="Close edition details">
                  <i className="fa-solid fa-xmark" />
                </button>
                <div>
                  <span>{selectedEdition.year}</span>
                  <h3>{selectedEdition.theme}</h3>
                  <p>{selectedEdition.date} · {selectedEdition.venue}</p>
                </div>
              </div>

              <div className="legacy-panel-grid">
                <section>
                  <h4>Speakers</h4>
                  <p>{selectedEdition.speakers}</p>
                </section>
                <section>
                  <h4>Achievements</h4>
                  <p>{selectedEdition.achievements}</p>
                </section>
                <section>
                  <h4>Key Highlights</h4>
                  <ul>
                    {selectedEdition.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </section>
                <section className="legacy-stat-strip">
                  {selectedEdition.stats.map((stat) => <span key={stat}>{stat}</span>)}
                </section>
              </div>

              <div className="legacy-gallery-row">
                {[selectedEdition.image, ...yrocEditions.filter((edition) => edition.year !== selectedEdition.year).slice(0, 3).map((edition) => edition.image)].map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt="" />
                ))}
              </div>
              <div className="legacy-video-placeholder">
                <i className="fa-solid fa-play" />
                <span>Conference film and archive video section</span>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
