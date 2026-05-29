import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const galleryItems = [
  {
    title: 'Event Photo 1',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.14.30 PM.jpeg',
    category: 'Venue'
  },
  {
    title: 'Event Photo 2',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.15.20 PM.jpeg',
    category: 'Speakers'
  },
  {
    title: 'Event Photo 3',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.18.47 PM.jpeg',
    category: 'Audience'
  },
  {
    title: 'Event Photo 4',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.19.16 PM.jpeg',
    category: 'Sessions'
  },
  {
    title: 'Event Photo 5',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.19.51 PM.jpeg',
    category: 'Audience'
  },
  {
    title: 'Event Photo 6',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.26.00 PM.jpeg',
    category: 'Sessions'
  },
  {
    title: 'Event Photo 7',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.32.00 PM.jpeg',
    category: 'Venue'
  },
  // Removed Event Photo 8 (missing `src`)
  {
    title: 'Event Photo 9',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.37.06 PM.jpeg',
    category: 'Audience'
  },
  {
    title: 'Event Photo 10',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.37.38 PM.jpeg',
    category: 'Sessions'
  },
  {
    title: 'Event Photo 11',
    src: '/uploads/gallery/WhatsApp Image 2026-05-29 at 4.38.46 PM.jpeg',
    category: 'Venue'
  }
];

export default function Gallery() {
  const MotionDiv = motion.div;
  const MotionFigure = motion.figure;

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Venue', 'Speakers', 'Sessions', 'Audience'];

  const visibleItems = useMemo(() => {
    const withValidSrc = galleryItems.filter((item) => Boolean(item?.src));

    return activeCategory === 'All'
      ? withValidSrc
      : withValidSrc.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <MotionDiv initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell">
      <motion.section
        className="page-section-tight"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="page-title" style={{ marginBottom: '14px' }}>
          <span className="gradient-text">Event Gallery</span>
        </h1>
        <p className="page-lead">
          A dedicated, responsive gallery for conference images. You can add your own photos in this structure and scale it as your archive grows.
        </p>
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="trend-chip"
              type="button"
              style={{
                cursor: 'pointer',
                background: activeCategory === category ? 'rgba(46,134,222,0.18)' : undefined,
                borderColor: activeCategory === category ? 'rgba(46,134,222,0.7)' : undefined
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section
        style={{ padding: '20px 0 90px' }}
        className="gallery-grid"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        {visibleItems.map((item) => (
          <MotionFigure
            key={item.title}
            whileHover={{ y: -5 }}
            className="media-tile"
            style={{ margin: 0 }}
          >
            <img src={item.src} alt={item.title} />
          </MotionFigure>
        ))}
      </motion.section>
    </MotionDiv>
  );
}

