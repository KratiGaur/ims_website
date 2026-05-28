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
    title: 'Oncology Symposium Hall',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    category: 'Venue'
  },
  {
    title: 'Clinical Team Collaboration',
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    category: 'Speakers'
  },
  {
    title: 'Audience Engagement',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    category: 'Audience'
  },
  {
    title: 'Scientific Showcase',
    src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80',
    category: 'Sessions'
  },
  {
    title: 'Networking Session',
    src: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=1200&q=80',
    category: 'Audience'
  },
  {
    title: 'Conference Moments',
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    category: 'Sessions'
  }
];

export default function Gallery() {
  const MotionDiv = motion.div;
  const MotionFigure = motion.figure;
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Venue', 'Speakers', 'Sessions', 'Audience'];

  const visibleItems = useMemo(() => (
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)
  ), [activeCategory]);

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
          <MotionFigure key={item.title} whileHover={{ y: -5 }} className="media-tile" style={{ margin: 0 }}>
            <img src={item.src} alt={item.title} />
            <div className="media-overlay">View Image</div>
            <figcaption className="media-caption">{item.title} - {item.category}</figcaption>
          </MotionFigure>
        ))}
      </motion.section>
    </MotionDiv>
  );
}
