import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchAbstracts, updateAbstract } from '../services/content';
import { fetchAdmins } from '../services/users';

function AbstractManagementPage() {
  const { csrfToken } = useAuth();
  const [abstracts, setAbstracts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [abstractResponse, adminResponse] = await Promise.all([fetchAbstracts(), fetchAdmins()]);
      setAbstracts(abstractResponse.data || []);
      setAdmins(adminResponse.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load abstracts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleSelect = (item) => {
    setSelected(item);
    setMessage('');
  };

  const activeReviewers = useMemo(() => admins.filter((admin) => Number(admin.status) === 1), [admins]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selected) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage('');
    try {
      const token = await ensureCsrfToken();
      await updateAbstract(
        {
          id: selected.id,
          status: selected.status,
          review_comments: selected.review_comments,
          assigned_reviewer: selected.assigned_reviewer,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Abstract updated.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update abstract.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Abstracts</p>
          <h1 className="page-title">Abstract management</h1>
          <p className="page-copy">Review submissions, assign reviewers, and update abstract status.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Submissions</h2>
            <span className="admin-badge">{abstracts.length} total</span>
          </div>
          {loading ? (
            <p>Loading abstracts...</p>
          ) : (
            <ul className="admin-list">
              {abstracts.length === 0 ? (
                <li className="admin-list-empty">No abstracts have been submitted.</li>
              ) : (
                abstracts.map((item) => (
                  <li key={item.id} className={`admin-list-item ${selected?.id === item.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelect(item)}>
                      <strong>{item.paper_title}</strong>
                      <span style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        {item.presenting_author_email} • {item.category}
                      </span>
                    </button>
                    <span className="admin-badge">{item.status}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Review abstract' : 'Select an abstract'}</h2>
          {selected ? (
            <form onSubmit={handleSave} className="admin-form">
              <div className="section-card" style={{ padding: 16, background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ margin: '0 0 8px' }}><strong>{selected.paper_title}</strong></p>
                <p style={{ margin: '0 0 6px' }}>{selected.authors}</p>
                <p style={{ margin: '0 0 6px' }}>{selected.presenting_author_email}</p>
                <p style={{ margin: '0 0 6px' }}>{selected.category}</p>
                {selected.file_url ? (
                  <a href={selected.file_url} target="_blank" rel="noreferrer">
                    View uploaded file
                  </a>
                ) : null}
              </div>
              <label>
                Abstract text
                <textarea rows={8} value={selected.abstract_text || ''} readOnly />
              </label>
              <label>
                Status
                <select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value })}>
                  <option value="pending">pending</option>
                  <option value="review">review</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
              </label>
              <label>
                Reviewer
                <select
                  value={selected.assigned_reviewer || ''}
                  onChange={(event) => setSelected({ ...selected, assigned_reviewer: event.target.value ? Number(event.target.value) : null })}
                >
                  <option value="">Unassigned</option>
                  {activeReviewers.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Review comments
                <textarea
                  rows={6}
                  value={selected.review_comments || ''}
                  onChange={(event) => setSelected({ ...selected, review_comments: event.target.value })}
                />
              </label>
              {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
              {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
              <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save review'}
              </button>
            </form>
          ) : (
            <p>Select an abstract to update status and review notes.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default AbstractManagementPage;
