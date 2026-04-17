import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About IMS', path: '/about' },
    { name: 'Abstract', path: '/abstract' },
    { name: 'Committee', path: '/committee' },
    { name: 'Media', path: '/media' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Register', path: '/registration' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="glass-nav nav-shell">
      <NavLink
        to="/"
        onClick={() => setIsMenuOpen(false)}
        style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '2px' }}
      >
        <span className="gradient-text">YROC '26</span>
      </NavLink>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? 'Close' : 'Menu'}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              textShadow: isActive ? '0 0 18px rgba(168, 85, 247, 0.35)' : 'none',
              transition: 'color 0.3s ease, text-shadow 0.3s ease'
            })}
          >
            {link.name}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label="Toggle dark and light mode"
        >
          {theme === 'light' ? 'Dark 🌙' : 'Light ☀️'}
        </button>
      </div>
    </nav>
  );
}
