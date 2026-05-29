import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="admin-page-shell admin-not-found-shell">
      <div className="admin-not-found-card">
        <h1>Page Not Found</h1>
        <p>The admin URL you requested does not exist. Use the sidebar to navigate the dashboard.</p>
        <Link to="/admin/dashboard" className="admin-button admin-button-secondary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
