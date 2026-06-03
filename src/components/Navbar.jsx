import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGroup, motion as Motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';

const navItemMotion = {
  rest: { y: 0, scale: 1 },
  hover: { y: -1, scale: 1.01 }
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const links = useMemo(() => ([
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
  ]), []);

  const isAboutActive = location.pathname.startsWith('/about');

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

      <LayoutGroup id="site-nav">
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            link.submenu ? (
              <div key={link.name} className="nav-item nav-dropdown">
                <Motion.div
                  className="nav-item__motion"
                  variants={navItemMotion}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `nav-link-pill ${isActive || isAboutActive ? 'is-active' : ''}`}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    {link.name}
                  </NavLink>
                  {(isAboutActive || location.pathname === link.path) ? (
                    <Motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.65 }}
                    />
                  ) : null}
                </Motion.div>
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
              <Motion.div
                key={link.name}
                className="nav-item"
                variants={navItemMotion}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `nav-link-pill ${isActive ? 'is-active' : ''}`}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {link.name}
                </NavLink>
                {location.pathname === link.path ? (
                  <Motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.65 }}
                  />
                ) : null}
              </Motion.div>
            )
          ))}

        </div>
      </LayoutGroup>
    </nav>
  );
}
