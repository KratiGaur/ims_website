import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchAbstracts, updateAbstract } from '../services/content';

function AbstractManagementPage() {
  const { csrfToken } = useAuth();
  const [abstracts, setAbstracts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadAbstracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAbstracts();
      setAbstracts(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load abstracts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbstracts();
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
      await loadAbstracts();
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
          <h2>Submissions</h2>
          {loading ? (
            <p>Loading abstracts…</p>
          ) : (
            <ul className="admin-list">
              {abstracts.length === 0 ? (
                <li className="admin-list-empty">No abstracts have been submitted.</li>
              ) : (
                abstracts.map((item) => (
                  <li key={item.id} className={`admin-list-item ${selected?.id === item.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelect(item)}>
                      {item.paper_title}
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
              <p><strong>{selected.paper_title}</strong></p>
              <p>{selected.authors}</p>
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
                Review comments
                <textarea rows={6} value={selected.review_comments || ''} onChange={(event) => setSelected({ ...selected, review_comments: event.target.value })} />
              </label>
              <label>
                Reviewer ID
                <input type="number" value={selected.assigned_reviewer || ''} onChange={(event) => setSelected({ ...selected, assigned_reviewer: Number(event.target.value) || null })} />
              </label>
              {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
              {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
              <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save review'}
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
