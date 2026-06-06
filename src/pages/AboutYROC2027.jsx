import React from 'react';
import { motion } from 'framer-motion';
import YrocLegacyUniverse from '../components/YrocLegacyUniverse';
import CinematicBackdrop from '../components/CinematicBackdrop';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }
};

export default function AboutYROC2027() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="content-shell cinematic-page" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <CinematicBackdrop />
      <YrocLegacyUniverse />
    </motion.div>
  );
}
