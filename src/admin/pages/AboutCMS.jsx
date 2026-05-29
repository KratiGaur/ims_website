import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchPageBlocks, savePageBlock } from '../services/content';

function AboutCMSPage() {
  const pageKey = 'about';
  const { csrfToken } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const loadBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPageBlocks(pageKey);
      setBlocks(response.data || []);
      setActiveBlock(response.data?.[0] ?? null);
    } catch (err) {
      setError(err.message || 'Unable to load about page content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const token = await ensureCsrfToken();
      await savePageBlock(
        {
          id: activeBlock?.id,
          page_key: pageKey,
          block_key: activeBlock?.block_key,
          title: activeBlock?.title || '',
          content: { body: activeBlock?.content?.body ?? '' },
          metadata: activeBlock?.metadata ?? {},
          order: activeBlock?.order ?? 0,
          active: activeBlock?.active ?? true,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('About page content saved.');
      await loadBlocks();
    } catch (err) {
      setError(err.message || 'Unable to save about page content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">About</p>
          <h1 className="page-title">About page CMS</h1>
          <p className="page-copy">Update institute, host city, and mission sections with live content blocks.</p>
        </div>
      </div>
      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Content blocks</h2>
          </div>
          {loading ? (
            <p>Loading content...</p>
          ) : (
            <ul className="admin-list">
              {blocks.length === 0 ? (
                <li className="admin-list-empty">No About blocks found. Use this editor to add one.</li>
              ) : (
                blocks.map((block) => (
                  <li key={block.id} className={`admin-list-item ${activeBlock?.id === block.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => setActiveBlock(block)}>
                      {block.title || block.block_key}
                    </button>
                    <span className="admin-badge">{block.active ? 'Visible' : 'Hidden'}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{activeBlock ? 'Edit content block' : 'Create a new block'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <label>
              Title
              <input
                type="text"
                value={activeBlock?.title || ''}
                onChange={(event) => setActiveBlock({ ...activeBlock, title: event.target.value })}
                required
              />
            </label>
            <label>
              Body
              <textarea
                rows={10}
                value={activeBlock?.content?.body || ''}
                onChange={(event) => setActiveBlock({
                  ...activeBlock,
                  content: { ...(activeBlock?.content ?? {}), body: event.target.value },
                })}
                required
              />
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={activeBlock?.active ?? true}
                onChange={(event) => setActiveBlock({ ...activeBlock, active: event.target.checked })}
              />
              <span>Active</span>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving || !activeBlock}>
              {saving ? 'Saving...' : 'Save block'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AboutCMSPage;
