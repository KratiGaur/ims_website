import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPublicMediaItems } from '../services/publicContent';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const fallbackMediaItems = [
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

function isVideoItem(item) {
  const mediaType = (item?.type || '').toLowerCase();
  if (mediaType.includes('video')) {
    return true;
  }

  return /\.(mp4|webm|ogg|mov)$/i.test(item?.url || '');
}

function isPdfItem(item) {
  const mediaType = (item?.type || '').toLowerCase();
  if (mediaType.includes('pdf') || mediaType.includes('document') || mediaType.includes('poster')) {
    return true;
  }

  return /\.pdf$/i.test(item?.url || '');
}

function formatMediaDescription(item) {
  const descriptionParts = [item?.metadata?.description, item?.category, item?.tags].filter(Boolean);

  if (descriptionParts.length > 0) {
    return descriptionParts.join(' • ');
  }

  return 'Conference media item added from the admin panel.';
}

export default function Media() {
  const MotionDiv = motion.div;
  const MotionArticle = motion.article;
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMedia = async () => {
      try {
        const response = await fetchPublicMediaItems();
        if (!mounted) {
          return;
        }
        setMediaItems(response.data || []);
      } catch {
        if (mounted) {
          setMediaItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleItems = mediaItems.length > 0 ? mediaItems : fallbackMediaItems;
  const spotlight = useMemo(() => {
    const source = mediaItems.length > 0 ? mediaItems : fallbackMediaItems;
    const tags = source.map((item) => item.category || item.title).filter(Boolean);
    return [...new Set(tags)].slice(0, 4);
  }, [mediaItems]);

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
          {loading
            ? 'Loading the latest media from the admin panel...'
            : 'This section reflects the latest media uploaded from the admin panel.'}
        </p>
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {spotlight.map((chip) => (
            <span key={chip} className="trend-chip">
              {chip}
            </span>
          ))}
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
        {visibleItems.map((item) => (
          <MotionArticle key={item.title} whileHover={{ y: -5 }} className="media-tile">
            {isVideoItem(item) ? (
              <video controls preload="metadata">
                <source src={item.url || item.src} type="video/mp4" />
              </video>
            ) : isPdfItem(item) ? (
              <iframe
                src={item.url || item.src}
                title={item.title}
                style={{ width: '100%', height: '100%', minHeight: 280, border: 'none' }}
              />
            ) : (
              <img src={item.url || item.src} alt={item.title} />
            )}
            <div className="media-overlay">{isVideoItem(item) ? 'Play Video' : 'View Photo'}</div>
            <div className="media-caption">
              <h3 style={{ margin: '0 0 8px', color: 'var(--accent)' }}>{item.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{item.description || formatMediaDescription(item)}</p>
            </div>
          </MotionArticle>
        ))}
      </motion.section>
    </MotionDiv>
  );
}
