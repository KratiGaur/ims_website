import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ logos = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const links = [
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
  ];

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
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            link.submenu ? (
              <div
                key={link.name}
                className={`nav-item nav-dropdown ${openDropdown === link.name ? 'open' : ''}`}
                onMouseEnter={() => setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger"
                  onClick={() => setOpenDropdown((current) => (current === link.name ? null : link.name))}
                >
                  {link.name}
                </button>
                <div className="dropdown-menu">
                  {link.submenu.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={closeMenus}
                      className="dropdown-link"
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
                onClick={closeMenus}
                className="nav-link-item"
              >
                {link.name}
              </NavLink>
            )
          ))}
        </div>

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
