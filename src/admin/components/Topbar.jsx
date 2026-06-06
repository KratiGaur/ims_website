import React from 'react';
import { useAuth } from '../context/AuthContext';

function Topbar({ user }) {
  const { logout } = useAuth();

  return (
    <header className="admin-topbar glass-card">
      <div className="topbar-left">
        <div className="topbar-badge">Admin panel</div>
        <p className="topbar-copy">Manage content and website updates with the same visual language as the public site.</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-user-card">
          <span>{user?.name || 'Admin'}</span>
          <small>{user?.role_name || 'Administrator'}</small>
        </div>
        <button type="button" className="admin-button admin-button-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
