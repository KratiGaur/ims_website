import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const links = [
    { name: 'Home', path: '/' },
    {
      name: 'About',
      path: '/about',
      submenu: [
        { name: 'About IMS', path: '/about#about-ims' },
        { name: 'About Bareilly', path: '/about#about-bareilly' },
        { name: 'About YROC', path: '/about#about-yroc' }
      ]
    },
    { name: 'Invitation', path: '/invitation' },
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
        <span className="gradient-text">YROC '27</span>
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
          link.submenu ? (
            <div key={link.name} className="nav-item nav-dropdown">
              <NavLink
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
              <div className="dropdown-menu">
                {link.submenu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="dropdown-link"
                    style={({ isActive }) => ({
                      fontSize: '0.85rem',
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      fontWeight: 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      transition: 'color 0.2s ease'
                    })}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
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
          )
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
