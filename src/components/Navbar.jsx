import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGroup, motion as Motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';

const navItemMotion = {
  rest: { y: 0, scale: 1 },
  hover: { y: -1, scale: 1.01 }
};

export default function Navbar({ logos = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const links = useMemo(() => ([
    { name: 'Home', path: '/' },
    {
      name: 'About',
      path: '/about',
      submenu: [
        { name: 'About IMS', path: '/about' },
        { name: 'About Bareilly', path: '/about/bareilly' },
        { name: 'About YROC', path: '/about/yroc' }
      ]
    },
    { name: 'Invitation', path: '/invitation' },
    { name: 'Abstract', path: '/abstract' },
    { name: 'Committee', path: '/committee' },
    { name: 'Media', path: '/media' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Register', path: '/registration' },
    { name: 'Events', path: '/events' },
    { name: 'Accommodation', path: '/accommodation' }
  ]), []);

  const isAboutActive = location.pathname.startsWith('/about');

  return (
    <header className="unified-sticky-header">
      <div className="top-logo-bar" aria-label="Conference partner logos">
        <div className="top-logo-bar-inner content-shell">
          {logos.map((logo, index) => {
            const src = typeof logo === 'string' ? logo : logo?.src;
            const alt = typeof logo === 'string' ? `Logo ${index + 1}` : logo?.alt || `Partner logo ${index + 1}`;

            return (
              <div key={src || index} className="top-logo-slot">
                {src && <img src={src} alt={alt} />}
              </div>
            );
          })}
        </div>
      </div>

      <nav className="glass-nav nav-shell">
        <LayoutGroup id="site-nav">
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {links.map((link) => (
              link.submenu ? (
                <div
                  key={link.name}
                  className={`nav-item nav-dropdown ${openDropdown === link.name ? 'open' : ''}`}
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Motion.div
                    className="nav-item__motion"
                    variants={navItemMotion}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <button
                      type="button"
                      className={`nav-dropdown-trigger nav-link-pill ${isAboutActive ? 'is-active' : ''}`}
                      onClick={() => setOpenDropdown((current) => (current === link.name ? null : link.name))}
                      style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}
                    >
                      {link.name}
                    </button>
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
                        onClick={closeMenus}
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
                    onClick={closeMenus}
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

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </nav>
    </header>
  );
}
