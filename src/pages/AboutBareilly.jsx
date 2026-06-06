import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { X } from 'lucide-react';

import BareillyAttractionCard from '../components/BareillyAttractionCard';
import CinematicBackdrop from '../components/CinematicBackdrop';
import OptimizedImage from '../components/OptimizedImage';
import { bareillyAttractions } from '../data/bareillyAttractions';
import heroFallback from '../assets/hero.png';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 42, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] } }
};

function AttractionModal({ attraction, onClose, modalRef }) {
  const [imgSrc, setImgSrc] = useState(attraction.image);

  return (
    <motion.div
      className="cinematic-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <motion.div
        ref={modalRef}
        className="section-card attraction-modal-shell cinematic-modal-shell w-full max-w-3xl overflow-hidden"
        layoutId={`card-${attraction.id}`}
        onClick={(event) => event.stopPropagation()}
        initial={{ y: 28, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ y: 28, scale: 0.94, filter: 'blur(8px)' }}
        transition={{ type: 'spring', stiffness: 190, damping: 24, mass: 0.95 }}
      >
        <button type="button" className="modal-icon-close" onClick={onClose} aria-label="Close attraction details">
          <X size={19} strokeWidth={2.4} />
        </button>
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

          <button type="button" className="glassy-cta modal-close-text" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutBareilly() {
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
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell medium-shell cinematic-page">
        <CinematicBackdrop />
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
          id="about-bareilly"
          className="page-section about-attractions-section"
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
