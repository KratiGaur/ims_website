import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Homepage CMS', to: '/admin/homepage' },
  { label: 'About CMS', to: '/admin/about' },
  { label: 'Invitation CMS', to: '/admin/invitation' },
  { label: 'Abstracts', to: '/admin/abstracts' },
  { label: 'Committee', to: '/admin/committee' },
  { label: 'Media', to: '/admin/media' },
  { label: 'Gallery', to: '/admin/gallery' },
  { label: 'Registrations', to: '/admin/registrations' },
  { label: 'SEO', to: '/admin/seo' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Settings', to: '/admin/settings' },
];

function Sidebar({ user }) {
  return (
    <aside className="admin-sidebar glass-card">
      <div className="admin-sidebar-brand">
        <div className="brand-mark" />
        <div>
          <h2>YROC 2027</h2>
          <p>Conference CMS</p>
        </div>
      </div>

      <nav className="admin-nav-list">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <p className="sidebar-role">Role: {user?.role_name || 'Unknown'}</p>
        <p className="sidebar-note">Secure area | session protected</p>
      </div>
    </aside>
  );
}

export default Sidebar;
