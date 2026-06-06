import React, { useState } from 'react';
import { motion } from 'framer-motion';

import heroFallback from '../assets/hero.png';
import OptimizedImage from './OptimizedImage';

export default function BareillyAttractionCard({ attraction, index = 0, compact = false, onClick }) {
  const [imgSrc, setImgSrc] = useState(attraction.image);
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--glare-x', `${((x + 1) * 50).toFixed(2)}%`);
    event.currentTarget.style.setProperty('--glare-y', `${((y + 1) * 50).toFixed(2)}%`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    event.currentTarget.style.setProperty('--glare-x', '50%');
    event.currentTarget.style.setProperty('--glare-y', '50%');
  };

  return (
    <motion.div
      className={compact ? 'attraction-showcase-card attraction-showcase-card-compact cinematic-tilt-card' : 'attraction-showcase-card cinematic-tilt-card'}
      layoutId={`card-${attraction.id}`}
      initial={{ opacity: 0, y: 34, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1], delay: index * 0.045 }}
      whileHover={{ y: -10 }}
      style={onClick ? { cursor: 'pointer' } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
