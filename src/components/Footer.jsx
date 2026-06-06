import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'About', to: '/about' },
  { label: 'Committee', to: '/committee' },
  { label: 'Invitation', to: '/invitation' },
  { label: 'Abstracts', to: '/abstract' },
  { label: 'Registration', to: '/registration' },
  { label: 'Events', to: '/events' },
  { label: 'Accommodation', to: '/accommodation' },
  { label: 'Contact', to: '/contact' }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="content-shell">
        <div className="footer-card">
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">YROC 2027</h4>
              <p className="footer-copy">
                Young Radiation Oncology Conference 2027 focused on the cancer care continuum from prevention to palliative support.
              </p>
              <p className="footer-copy mb-0">Hosted by Shri Ram Murti Smarak Institute of Medical Sciences, Bareilly</p>
            </div>

            <div>
              <h5 className="footer-heading">Quick Links</h5>
              <div className="footer-links">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} className="footer-link">
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <h5 className="footer-heading">Contact</h5>
              <p className="footer-copy mb-2">SRMS IMS Campus, Bareilly, Uttar Pradesh, India</p>
              <p className="footer-copy mb-2">Conference contact details to be updated</p>
              <p className="footer-copy mb-3">YROC 2027 conference desk</p>
              <div className="footer-socials">
                <a href="#" aria-label="Instagram" className="footer-social">Instagram</a>
                <a href="#" aria-label="LinkedIn" className="footer-social">LinkedIn</a>
                <a href="#" aria-label="YouTube" className="footer-social">YouTube</a>
                <a href="#" aria-label="X" className="footer-social">X</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} YROC 2027. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
