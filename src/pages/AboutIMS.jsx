import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

import BareillyAttractionCard from '../components/BareillyAttractionCard';
import OptimizedImage from '../components/OptimizedImage';
import { bareillyAttractions } from '../data/bareillyAttractions';
import heroFallback from '../assets/hero.png';

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
    <motion.div
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
      <motion.div
        ref={modalRef}
        className="section-card attraction-modal-shell w-full max-w-3xl overflow-hidden"
        layoutId={`card-${attraction.id}`}
        onClick={(event) => event.stopPropagation()}
        initial={{ y: 20, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <motion.div className="attraction-visual attraction-modal-visual" layoutId={`image-${attraction.id}`}>
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
          <motion.p className="attraction-label" layoutId={`label-${attraction.id}`}>
            {attraction.label}
          </motion.p>
          <motion.h2 className="attraction-name-badge attraction-modal-name" layoutId={`title-${attraction.id}`}>
            {attraction.title}
          </motion.h2>
        </motion.div>

        <div className="attraction-modal-copy">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.35, ease: 'easeOut' }}
            className="attraction-modal-description"
          >
            <p>{attraction.description}</p>
          </motion.div>

          <div className="d-flex justify-content-end">
            <button type="button" className="glassy-cta" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutIMS() {
  const [activeCard, setActiveCard] = useState(null);
  const modalRef = useRef(null);

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

  return (
    <LayoutGroup>
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
        </motion.section>

        <motion.section
          className="page-section-tight"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className="about-detail-grid">
            {instituteHighlights.map((item) => (
              <article key={item.title} className="section-card about-detail-card">
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
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
        </motion.section>

        <motion.section
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
        </motion.section>

        <AnimatePresence>
          {activeCard ? (
            <AttractionModal
              attraction={activeCard}
              onClose={() => setActiveCard(null)}
              modalRef={modalRef}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
