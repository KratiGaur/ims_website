import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './PremiumHeader.css';


const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function PremiumHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      document.documentElement.style.setProperty('--header-scroll', String(clamp(window.scrollY / 120, 0, 1)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`premium-header ${scrolled ? 'is-scrolled' : ''}`}
      role="banner"
      aria-label="Conference header"
    >
      <div className="premium-header-inner content-shell">
        <div className="premium-header-left-space"></div>

        <div className="premium-header-middle">
          <div className="header-info-item">
            <i className="fa-solid fa-calendar-days"></i>
            <span>Dec 1 - 3, 2027</span>
          </div>
          <div className="header-info-item">
            <i className="fa-solid fa-location-dot"></i>
            <span>SRMS IMS, Bareilly</span>
          </div>
        </div>

        <div className="premium-brand premium-brand-right" aria-label="SRMS IMS">
          <img src="/src/assets/srms-logo.png" alt="SRMS IMS Logo" className="header-logo" />
        </div>
      </div>
    </header>
  );
}

