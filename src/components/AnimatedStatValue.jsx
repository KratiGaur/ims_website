import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedStatValue({ value }) {
  const numericStr = value.replace(/[^0-9]/g, '');
  const numericValue = parseInt(numericStr, 10);
  const suffix = value.replace(numericStr, '');
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return controls.stop;
  }, [numericValue]);

  return <>{displayValue}{suffix}</>;
}
