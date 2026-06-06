import React, { useEffect, useState } from 'react';
import { fetchJson } from '../services/api';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson('dashboard/stats.php')
      .then((data) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Admin Dashboard</p>
          <h1 className="page-title">YROC 2027 Control Center</h1>
          <p className="page-copy">Manage content, media, registrations, SEO, and access from one secure location.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {loading ? (
          <div className="dashboard-skeleton" />
        ) : (
          ['registrations', 'abstracts', 'active_media', 'pending_reviews'].map((key) => (
            <article key={key} className="dashboard-card glass-card">
              <p className="card-label">{stats?.labels?.[key] || key.replace('_', ' ')}</p>
              <p className="card-value">{stats?.values?.[key] ?? '0'}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
