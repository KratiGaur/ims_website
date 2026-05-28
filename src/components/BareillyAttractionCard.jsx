import React, { useState } from 'react';
import { motion } from 'framer-motion';

import heroFallback from '../assets/hero.png';
import OptimizedImage from './OptimizedImage';

export default function BareillyAttractionCard({ attraction, index = 0, compact = false }) {
  const [imgSrc, setImgSrc] = useState(attraction.image);

  return (
    <motion.article
      className={compact ? 'attraction-showcase-card attraction-showcase-card-compact' : 'attraction-showcase-card'}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.06 }}
      whileHover={{ y: -8 }}
    >
      <div className="attraction-visual">
        <OptimizedImage
          src={imgSrc}
          alt={attraction.title}
          width={compact ? 900 : 1400}
          height={compact ? 1125 : 1120}
          className="attraction-photo"
          onError={() => setImgSrc(heroFallback)}
          sizes={compact ? '(max-width: 768px) 78vw, 34vw' : '(max-width: 768px) 90vw, 33vw'}
        />
        <div className="attraction-wash" />
        <span className="attraction-label">{attraction.label}</span>
        <div className="attraction-name-badge">
          {attraction.title}
        </div>
      </div>
    </motion.article>
  );
}
