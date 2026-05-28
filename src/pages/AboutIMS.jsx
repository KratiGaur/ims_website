import React from 'react';
import { motion } from 'framer-motion';
import BareillyAttractionCard from '../components/BareillyAttractionCard';
import { bareillyAttractions } from '../data/bareillyAttractions';

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

export default function AboutIMS() {
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
              <span className="gradient-text">SRMS IMS and Bareilly</span>
            </h1>
            <p className="page-lead">
              YROC 2027 brings together the academic strength of SRMSIMS with the cultural energy of Bareilly. This page introduces the institute, the city's identity, and the local attractions delegates may want to explore during the conference.
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
            Eight image cards arranged in a balanced 4-column grid on desktop and a responsive stack on smaller screens.
          </p>
        </div>

        <div className="about-attractions-grid">
          {bareillyAttractions.map((attraction, index) => (
            <BareillyAttractionCard key={attraction.title} attraction={attraction} index={index} />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
