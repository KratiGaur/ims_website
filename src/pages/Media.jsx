import React from 'react';
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

const mediaItems = [
  {
    type: 'video',
    title: 'Opening Ceremony Highlights',
    src: 'https://cdn.pixabay.com/video/2021/11/08/97528-645510486_large.mp4',
    description: 'A short teaser from opening moments and keynote introductions.'
  },
  {
    type: 'video',
    title: 'Research Presentation Reel',
    src: 'https://cdn.pixabay.com/video/2020/01/13/31175-385448102_large.mp4',
    description: 'Feature talks on latest oncology advances and collaborative science.'
  },
  {
    type: 'image',
    title: 'Session in Progress',
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
    description: 'Experts and delegates engaging during multidisciplinary discussions.'
  },
  {
    type: 'image',
    title: 'Panel Discussion',
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80',
    description: 'Panelists sharing cross-domain perspectives for patient-centered care.'
  },
  {
    type: 'image',
    title: 'Precision Oncology Workshop',
    src: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1400&q=80',
    description: 'Hands-on workshop snapshots from next-generation treatment planning.'
  },
  {
    type: 'image',
    title: 'Care & Community',
    src: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&w=1400&q=80',
    description: 'Moments that celebrate empathy, collaboration, and support networks.'
  }
];

export default function Media() {
  const MotionDiv = motion.div;
  const MotionArticle = motion.article;
  const spotlight = ['Trending Talks', 'Startup Showcase', 'Onco AI', 'Live Q&A'];

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
          <span className="gradient-text">Media Hub</span>
        </h1>
        <p className="page-lead">
          This section is built for dynamic storytelling with image and video support. Replace these placeholders with your official conference media files anytime.
        </p>
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {spotlight.map((chip) => <span key={chip} className="trend-chip">{chip}</span>)}
        </div>
      </motion.section>

      <motion.section
        style={{ padding: '20px 0 90px' }}
        className="media-grid"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        {mediaItems.map((item) => (
          <MotionArticle key={item.title} whileHover={{ y: -5 }} className="media-tile">
            {item.type === 'video' ? (
              <video controls preload="metadata">
                <source src={item.src} type="video/mp4" />
              </video>
            ) : (
              <img src={item.src} alt={item.title} />
            )}
            <div className="media-overlay">{item.type === 'video' ? 'Play Video' : 'View Photo'}</div>
            <div className="media-caption">
              <h3 style={{ margin: '0 0 8px', color: 'var(--accent)' }}>{item.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{item.description}</p>
            </div>
          </MotionArticle>
        ))}
      </motion.section>
    </MotionDiv>
  );
}
