import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchHomepageSections, saveHomepageSection } from '../services/content';

function HomepageCMSPage() {
  const { csrfToken } = useAuth();
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ section_key: '', title: '', body: '', order: 0, active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHomepageSections();
      setSections(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load homepage sections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const prepareNewSection = () => {
    setSelected(null);
    setDraft({
      section_key: `section_${Date.now()}`,
      title: '',
      body: '',
      order: sections.length + 1,
      active: true,
    });
    setMessage('');
  };

  const editSection = (section) => {
    setSelected(section.id);
    setDraft({
      id: section.id,
      section_key: section.key,
      title: section.title,
      body: section.content?.body ?? '',
      order: section.order,
      active: section.active,
    });
    setMessage('');
  };

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
      await saveHomepageSection(
        {
          id: draft.id,
          section_key: draft.section_key,
          title: draft.title,
          content: { body: draft.body },
          settings: {},
          order: draft.order,
          active: draft.active,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Homepage section saved.');
      await loadSections();
    } catch (err) {
      setError(err.message || 'Unable to save homepage section.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Homepage CMS</p>
          <h1 className="page-title">Live homepage content</h1>
          <p className="page-copy">Edit hero text, featured sections, and homepage section visibility.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Sections</h2>
            <button type="button" className="admin-button admin-button-secondary" onClick={prepareNewSection}>
              Add section
            </button>
          </div>

          {loading ? (
            <p>Loading homepage content...</p>
          ) : (
            <ul className="admin-list">
              {sections.length === 0 ? (
                <li className="admin-list-empty">No homepage sections configured yet.</li>
              ) : (
                sections.map((section) => (
                  <li key={section.id} className="admin-list-item">
                    <button type="button" className="admin-link-button" onClick={() => editSection(section)}>
                      {section.title || section.key}
                    </button>
                    <span className="admin-badge">{section.active ? 'Active' : 'Hidden'}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Edit section' : 'New section'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <label>
              Section title
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                required
                placeholder="Section title"
              />
            </label>
            <label>
              Content body
              <textarea
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                rows={6}
                placeholder="Section text or HTML body"
              />
            </label>
            <label>
              Order
              <input
                type="number"
                value={draft.order}
                onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
              />
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
              />
              <span>Active</span>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save section'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default HomepageCMSPage;
