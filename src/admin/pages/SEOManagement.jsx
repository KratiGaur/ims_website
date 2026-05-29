import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchSeoSettings, saveSeoSetting } from '../services/content';

function SEOManagementPage() {
  const { csrfToken } = useAuth();
  const [pages] = useState(['home', 'about', 'invitation', 'registration', 'abstract', 'committee', 'media', 'gallery', 'contact']);
  const [selectedPage, setSelectedPage] = useState('home');
  const [settings, setSettings] = useState({ title: '', description: '', og_title: '', og_description: '', og_image_url: '', keywords: '', schema_json: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadSettings = async (pageKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSeoSettings(pageKey);
      setSettings(response.data || { title: '', description: '', og_title: '', og_description: '', og_image_url: '', keywords: '', schema_json: {} });
    } catch (err) {
      setError(err.message || 'Unable to load SEO settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings(selectedPage);
  }, [selectedPage]);

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
      await saveSeoSetting(
        {
          page_key: selectedPage,
          title: settings.title,
          description: settings.description,
          og_title: settings.og_title,
          og_description: settings.og_description,
          og_image_url: settings.og_image_url,
          keywords: settings.keywords,
          schema_json: settings.schema_json,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('SEO settings saved.');
    } catch (err) {
      setError(err.message || 'Unable to save SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">SEO</p>
          <h1 className="page-title">SEO & metadata</h1>
          <p className="page-copy">Edit page metadata, OpenGraph tags, keywords, and structured schema for each public route.</p>
        </div>
      </div>

      <section className="glass-card admin-panel-card">
        <form onSubmit={handleSave} className="admin-form">
          <div className="form-row">
            <label>
              Page
              <select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)}>
                {pages.map((page) => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
            </label>
          </div>
          {loading ? (
            <p>Loading SEO settings…</p>
          ) : (
            <>
              <label>
                Title
                <input type="text" value={settings.title} onChange={(event) => setSettings({ ...settings, title: event.target.value })} required />
              </label>
              <label>
                Description
                <textarea rows={4} value={settings.description} onChange={(event) => setSettings({ ...settings, description: event.target.value })} />
              </label>
              <label>
                OpenGraph title
                <input type="text" value={settings.og_title} onChange={(event) => setSettings({ ...settings, og_title: event.target.value })} />
              </label>
              <label>
                OpenGraph description
                <textarea rows={3} value={settings.og_description} onChange={(event) => setSettings({ ...settings, og_description: event.target.value })} />
              </label>
              <label>
                OpenGraph image URL
                <input type="url" value={settings.og_image_url} onChange={(event) => setSettings({ ...settings, og_image_url: event.target.value })} />
              </label>
              <label>
                Keywords
                <input type="text" value={settings.keywords} onChange={(event) => setSettings({ ...settings, keywords: event.target.value })} />
              </label>
              <label>
                Schema JSON
                <textarea rows={6} value={JSON.stringify(settings.schema_json, null, 2)} onChange={(event) => {
                  try {
                    setSettings({ ...settings, schema_json: JSON.parse(event.target.value) });
                  } catch {
                    setSettings({ ...settings, schema_json: event.target.value });
                  }
                }} />
              </label>
              {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
              {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
              <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save SEO'}
              </button>
            </>
          )}
        </form>
      </section>
    </div>
  );
}

export default SEOManagementPage;
