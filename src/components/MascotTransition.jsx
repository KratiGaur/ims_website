import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function MascotTransition({ onFinish }) {
  const overlayControls = useAnimation();
  const neoControls = useAnimation();
  const nyraControls = useAnimation();

  const neoRef = useRef(null);
  const nyraRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!mounted) return;
      const width = window.innerWidth;
      const centerOffset = width < 768 ? '16vw' : width < 1200 ? '14vw' : '12vw';
      const centerOffsetLeft = `-${centerOffset}`;
      const centerOffsetRight = centerOffset;

      // Entrance: mascots slide in from the sides and stop near center, spaced for laptop/mobile clarity
      const entrance = Promise.all([
        neoControls.start({ x: centerOffsetLeft, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }),
        nyraControls.start({ x: centerOffsetRight, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } })
      ]);

      await entrance;

      // Add a subtle idle bob so mascots feel alive before waving
      neoControls.start({ y: [0, -6, 0], transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } });
      nyraControls.start({ y: [0, -6, 0], transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } });

      // Wave + reveal: single wave animation while reducing blur to 0 (slightly slower)
      const wave = Promise.all([
        neoControls.start({ y: [0, -10, 0], rotate: [0, -6, 0], transition: { duration: 1.0, ease: 'easeInOut' } }),
        nyraControls.start({ y: [0, -10, 0], rotate: [0, 6, 0], transition: { duration: 1.0, ease: 'easeInOut' } }),
        overlayControls.start({ ['--mask-blur']: '0px', opacity: 0, transition: { duration: 1.2, ease: 'easeOut' } })
      ]);

      await wave;

      // Move together toward chatbot position and scale down (slightly slower and smooth)
      const neoRect = neoRef.current.getBoundingClientRect();
      const nyraRect = nyraRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();

      const neoCenter = { x: neoRect.left + neoRect.width / 2, y: neoRect.top + neoRect.height / 2 };
      const nyraCenter = { x: nyraRect.left + nyraRect.width / 2, y: nyraRect.top + nyraRect.height / 2 };
      const targetCenter = { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 };

      const neoCurrentY = 0;
      const nyraCurrentY = 0;

      const neoDeltaX = targetCenter.x - neoCenter.x;
      const neoDeltaY = targetCenter.y - neoCenter.y;
      const nyraDeltaX = targetCenter.x - nyraCenter.x;
      const nyraDeltaY = targetCenter.y - nyraCenter.y;

      const move = Promise.all([
        neoControls.start({ x: neoDeltaX, y: neoDeltaY, scale: 0.62, rotate: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } }),
        nyraControls.start({ x: nyraDeltaX, y: nyraDeltaY, scale: 0.62, rotate: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } })
      ]);

      await move;

      // Small delay so users see mascots as chatbot before removing overlay
      await new Promise((res) => setTimeout(res, 300));

      if (onFinish) onFinish();
    };

    // initialize overlay blur var and mascots opacity/positions
    overlayControls.set({ ['--mask-blur']: '25px', opacity: 1 });
    neoControls.set({ x: '-65vw', y: 0, opacity: 0, scale: 1 });
    nyraControls.set({ x: '65vw', y: 0, opacity: 0, scale: 1 });

    run();

    return () => {
      mounted = false;
    };
  }, [neoControls, nyraControls, overlayControls, onFinish]);

  return (
    <motion.div
      animate={overlayControls}
      style={{ ['--mask-blur']: '25px' }}
      className="fixed inset-0 z-[9998] pointer-events-none"
    >
      {/* Backdrop that blurs the homepage behind it */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(8,8,10,0.12)',
          backdropFilter: 'blur(var(--mask-blur))',
          WebkitBackdropFilter: 'blur(var(--mask-blur))'
        }}
      />

      {/* Center stage for the mascots */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%', height: 'min(48vh, 420px)', minHeight: 240, maxHeight: 420, overflow: 'visible' }}>
          <motion.img
            ref={neoRef}
            src="/neo.png"
            alt="Neo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'clamp(120px, 22vw, 180px)',
              aspectRatio: '1 / 1',
              height: 'auto',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center'
            }}
            animate={neoControls}
            initial={false}
            draggable={false}
          />

          <motion.img
            ref={nyraRef}
            src="/nyra.png"
            alt="Nyra"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'clamp(120px, 22vw, 180px)',
              aspectRatio: '1 / 1',
              height: 'auto',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center center'
            }}
            animate={nyraControls}
            initial={false}
            draggable={false}
          />
        </div>
      </div>

      {/* Invisible target placeholder placed where the real chatbot sits */}
      <div ref={targetRef} style={{ position: 'fixed', right: 24, bottom: 24, width: 64, height: 64, pointerEvents: 'none', zIndex: 10000 }} />
    </motion.div>
  );
}
