import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { fetchPublicPageBlocks } from '../services/publicContent';
import BareillyAttractionCard from '../components/BareillyAttractionCard';
import OptimizedImage from '../components/OptimizedImage';
import { bareillyAttractions } from '../data/bareillyAttractions';
import heroFallback from '../assets/hero.png';

const Motion = motion;

const yrocPastEvents = [
  {
    id: '12th',
    label: '12th YROC (2026)',
    image: '/yroc_pastEvents/12thYroc.jpeg',
    title: '12th YROC 2025',
    body: `The 12th Young Radiation Oncologists Conference (YROC) was indeed held on 24th and 25th January 2026.\n\n• Venue: NIMHANS Convention Centre, Bengaluru, Karnataka.\n• Organizer: Department of Radiation Oncology, Kidwai Memorial Institute of Oncology.\n• Theme: "Radiate Knowledge, Transform Care"`
  },
  {
    id: '11th',
    label: '11th YROC (2025)',
    image: '/yroc_pastEvents/11thYroc.jpeg',
    title: '11th YROC 2025',
    body: `11th YROC 2025\n\n• Conducted in Madurai.\n• Theme: Challenges & Controversies in Clinical Oncology.\n• Sessions included stereotactic radiosurgery, brachytherapy, re-irradiation, debates, and practical oncology discussions`
  },
  {
    id: '10th',
    label: '10th YROC (2024)',
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
  return text.split('\n').map((l) => l.trimEnd());
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const instituteHighlights = [
  {
    title: 'About the Institute',
    body:
      'Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly, conceptualised in 2002, is a modern 1200-bed multi super speciality tertiary care hospital and medical college serving Bareilly and the surrounding region up to the farthest border towns of Uttarakhand and Nepal.'
  },
  {
    title: 'Advanced Infrastructure',
    body:
      'The institute houses advanced diagnostic and treatment infrastructure including 3 Tesla 48 channel MRI, 256 Slice Dual Source CT Scan, High Energy Linear Accelerator, HDR Brachytherapy, modular laminar flow OTs, critical care units, Cath Lab with DSA, the SSI Mantra Surgical Robotic System, and high-tech clinical laboratories.'
  },
  {
    title: 'Cancer Care Excellence',
    body:
      'The 100-bed R R Cancer Institute and Research Centre and the Department of Radiation Oncology together anchor high-quality oncology services across Uttar Pradesh and Uttarakhand through precision treatment, multidisciplinary coordination, and academic engagement.'
  }
];

function AttractionModal({ attraction, onClose, modalRef }) {
  const [imgSrc, setImgSrc] = useState(attraction.image);

  return (
    <Motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      style={{
        backdropFilter: 'blur(34px) saturate(0.9)',
        WebkitBackdropFilter: 'blur(34px) saturate(0.9)'
      }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Motion.div
        ref={modalRef}
        className="section-card attraction-modal-shell w-full max-w-3xl overflow-hidden"
        layoutId={`card-${attraction.id}`}
        onClick={(event) => event.stopPropagation()}
        initial={{ y: 20, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <Motion.div className="attraction-visual attraction-modal-visual" layoutId={`image-${attraction.id}`}>
          <OptimizedImage
            src={imgSrc}
            alt={attraction.title}
            width={1600}
            height={1100}
            className="attraction-photo"
            onError={() => setImgSrc(heroFallback)}
            sizes="(max-width: 768px) 92vw, 56vw"
          />
          <div className="attraction-wash" />
          <Motion.p className="attraction-label" layoutId={`label-${attraction.id}`}>
            {attraction.label}
          </Motion.p>
          <Motion.h2 className="attraction-name-badge attraction-modal-name" layoutId={`title-${attraction.id}`}>
            {attraction.title}
          </Motion.h2>
        </Motion.div>

        <div className="attraction-modal-copy">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.35, ease: 'easeOut' }}
            className="attraction-modal-description"
          >
            <p>{attraction.description}</p>
          </Motion.div>

          <div className="d-flex justify-content-end">
            <button type="button" className="glassy-cta" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
}

export default function AboutIMS() {
  const [activeCard, setActiveCard] = useState(null);
  const [activeEventId, setActiveEventId] = useState(yrocPastEvents[0]?.id ?? '12th');
  const [aboutBlocks, setAboutBlocks] = useState([]);
  const [aboutLoading, setAboutLoading] = useState(true);

  const activeEvent = yrocPastEvents.find((e) => e.id === activeEventId) ?? yrocPastEvents[0];

  const modalRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const loadAboutBlocks = async () => {
      try {
        const response = await fetchPublicPageBlocks('about');
        if (!mounted) {
          return;
        }
        setAboutBlocks(response.data || []);
      } catch {
        if (mounted) {
          setAboutBlocks([]);
        }
      } finally {
        if (mounted) {
          setAboutLoading(false);
        }
      }
    };

    loadAboutBlocks();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeCard) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveCard(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.body.style.overflow = '';
    };
  }, [activeCard]);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const aboutHighlightCards = aboutBlocks.length > 0
    ? aboutBlocks.map((block) => ({
      id: block.id,
      title: block.title || block.block_key,
      body: block?.content?.body || '',
    }))
    : instituteHighlights;

  return (
    <LayoutGroup>
      <Motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell">
        <Motion.section
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
                <span className="gradient-text">SRMS IMS and Bareilly</span>
              </h1>
              <p className="page-lead">
                YROC 2027 brings together the academic strength of SRMSIMS with the cultural energy of Bareilly. This page introduces the institute, the city&apos;s identity, and the local attractions delegates may want to explore during the conference.
              </p>
            </div>
            <div className="about-hero-stats">
              <div className="about-stat">
                <strong>1200</strong>
                <span>Beds</span>
              </div>
              <div className="about-stat">
                <strong>100</strong>
                <span>Cancer Care Beds</span>
              </div>
              <div className="about-stat">
                <strong>2002</strong>
                <span>Institute Vision Began</span>
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section
          id="about-ims"
          className="page-section-tight"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className="about-detail-grid">
            {aboutLoading && aboutBlocks.length === 0 ? (
              instituteHighlights.map((item) => (
                <article key={item.title} className="section-card about-detail-card">
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </article>
              ))
            ) : aboutHighlightCards.map((item) => (
              <article key={item.id || item.title} className="section-card about-detail-card">
                <h2>{item.title}</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>{item.body}</p>
              </article>
            ))}
          </div>
        </Motion.section>

        <Motion.section
          id="about-bareilly"
          className="page-section-tight"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className="section-card bareilly-story-card">
            <div className="bareilly-story-copy">
              <span className="about-kicker">Host City</span>
              <h2 className="bareilly-story-title">About Bareilly</h2>
              <p className="prose-copy">
                Bareilly, often known as Nath Nagri, brings together spiritual heritage, regional history, education, commerce, and contemporary civic identity. For YROC 2027 delegates, it offers more than a conference destination: it offers a city with recognizable landmarks, long-standing institutions, and a cultural atmosphere that feels both grounded and welcoming.
              </p>
              <p className="prose-copy">
                The city is associated with important temples, prominent dargahs, historic sites in the wider district, and public landmarks that have become part of its modern identity. This mix makes Bareilly a fitting setting for a conference centered on learning, connection, and compassionate care.
              </p>
              <p className="prose-copy">
                From heritage sites and spiritual landmarks to educational institutions and civic icons, Bareilly offers delegates and accompanying families a broader local experience beyond the conference venue.
              </p>
            </div>
          </div>
        </Motion.section>

        {/* YROC Past Events dropdown embedded inside About page */}
        <Motion.section
          id="about-yroc"
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
                  YROC
                </span>
                <h2 style={{ marginTop: 0, marginBottom: 0, color: 'var(--accent-primary)' }}>Past Events</h2>
              </div>

              <div style={{ minWidth: 260 }}>
                <label htmlFor="yroc-event-select-inline" style={{ display: 'block', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>
                  Select Edition
                </label>
                <select
                  id="yroc-event-select-inline"
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
                  {yrocPastEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.label}
                    </option>
                  ))}

                </select>
              </div>
            </div>

            <div className="about-yroc-layout" style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 16, alignItems: 'start' }}>
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

              <div className="about-yroc-image" style={{ flex: '0 0 42%', minWidth: 280 }}>
                <div className="section-card" style={{ padding: 12, background: 'transparent', borderRadius: 22 }}>
                  <img
                    src={activeEvent?.image}

                    alt={activeEvent?.title ?? 'YROC Past Event'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, display: 'block' }}
                    onError={(e) => {
                      e.currentTarget.src = '/hero.png';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section
          className="page-section"

          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.14 }}
        >
          <div className="about-section-heading">
            <span className="about-kicker">Local Attractions</span>
            <h2 className="bareilly-story-title">Discover Bareilly</h2>
            <p className="page-lead centered">
              Explore the rich cultural tapestry and natural beauty that define this historic city.
            </p>
          </div>

          <div className="about-attractions-grid">
            {bareillyAttractions.map((attraction, index) => (
              <BareillyAttractionCard
                key={attraction.id}
                attraction={attraction}
                index={index}
                onClick={setActiveCard}
              />
            ))}
          </div>
        </Motion.section>


        <AnimatePresence>
          {activeCard ? (
            <AttractionModal
              attraction={activeCard}
              onClose={() => setActiveCard(null)}
              modalRef={modalRef}
            />
          ) : null}
        </AnimatePresence>
      </Motion.div>
    </LayoutGroup>
  );
}
