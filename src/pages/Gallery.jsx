import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/OptimizedImage.jsx';
import { fetchPublicGalleryAlbums } from '../services/publicContent';


const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } }
};

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const fallbackGalleryItems = [
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
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        const response = await fetchPublicGalleryAlbums();
        if (!mounted) {
          return;
        }

        const albums = response.data || [];
        const flattenedItems = albums.flatMap((album) => {
          const albumItems = Array.isArray(album.items) ? album.items : [];
          if (albumItems.length > 0) {
            return albumItems.map((item) => ({
              title: item.title,
              src: item.thumbnail_url || item.url,
              category: album.title,
            }));
          }

          return album.cover_url ? [{
            title: album.title,
            src: album.cover_url,
            category: album.title,
          }] : [];
        });

        setGalleryItems(flattenedItems);
      } catch {
        if (mounted) {
          setGalleryItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleSource = galleryItems.length > 0 ? galleryItems : fallbackGalleryItems;
  const categories = ['All', ...new Set(visibleSource.map((item) => item.category).filter(Boolean))];

  const visibleItems = useMemo(() => {
    const withValidSrc = visibleSource.filter((item) => Boolean(item?.src));

    return activeCategory === 'All'
      ? withValidSrc
      : withValidSrc.filter((item) => item.category === activeCategory);
  }, [activeCategory, visibleSource]);

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
          {loading
            ? 'Loading the latest gallery albums from the admin panel...'
            : 'A dedicated, responsive gallery for conference images. Updated albums appear here automatically.'}
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
            <OptimizedImage
              src={item.src}
              alt={item.title}
              className="fit-cover-image"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 33vw, 33vw"
            />
          </MotionFigure>
        ))}
      </motion.section>
    </MotionDiv>
  );
}

