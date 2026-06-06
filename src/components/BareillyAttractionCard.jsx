import React, { useState } from 'react';
import { motion } from 'framer-motion';

import heroFallback from '../assets/hero.png';
import OptimizedImage from './OptimizedImage';

export default function BareillyAttractionCard({ attraction, index = 0, compact = false, onClick }) {
  const [imgSrc, setImgSrc] = useState(attraction.image);

  return (
    <motion.div
      className={compact ? 'attraction-showcase-card attraction-showcase-card-compact' : 'attraction-showcase-card'}
      layoutId={`card-${attraction.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      style={onClick ? { cursor: 'pointer' } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? () => onClick(attraction) : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick(attraction);
              }
            }
          : undefined
      }
    >
      <motion.div className="attraction-visual" layoutId={`image-${attraction.id}`}>
        <OptimizedImage
          src={imgSrc}
          alt={attraction.title}
          width={compact ? 800 : 1200}
          height={compact ? 800 : 1200}
          className="attraction-photo"
          onError={() => setImgSrc(heroFallback)}
          sizes={compact ? '(max-width: 768px) 42vw, 16vw' : '(max-width: 768px) 46vw, 24vw'}
        />
        <div className="attraction-wash" />
        <motion.p className="attraction-label" layoutId={`label-${attraction.id}`}>
          {attraction.label}
        </motion.p>
        <motion.h2 className="attraction-name-badge" layoutId={`title-${attraction.id}`}>
          {attraction.title}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}
