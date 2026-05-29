import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchGalleryData, saveGalleryEntity } from '../services/content';

function GalleryManagementPage() {
  const { csrfToken } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', cover_url: '', tags: '', order: 0, active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGalleryData();
      setAlbums(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load gallery data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleSelect = (album) => {
    setSelected(album);
    setForm({
      title: album.title,
      slug: album.slug,
      description: album.description,
      cover_url: album.cover_url,
      tags: album.tags,
      order: album.order,
      active: album.active,
    });
    setMessage('');
  };

  const handleNew = () => {
    setSelected(null);
    setForm({ title: '', slug: '', description: '', cover_url: '', tags: '', order: albums.length + 1, active: true });
    setMessage('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const token = await ensureCsrfToken();
      await saveGalleryEntity(
        {
          entity: 'album',
          id: selected?.id,
          title: form.title,
          slug: form.slug,
          description: form.description,
          cover_url: form.cover_url,
          tags: form.tags,
          order: form.order,
          active: form.active,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Gallery album saved.');
      await loadGallery();
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Unable to save gallery album.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Gallery</p>
          <h1 className="page-title">Gallery management</h1>
          <p className="page-copy">Create albums, reorder images, and maintain gallery collections.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Albums</h2>
            <button type="button" className="admin-button admin-button-secondary" onClick={handleNew}>
              Add album
            </button>
          </div>
          {loading ? (
            <p>Loading albums…</p>
          ) : (
            <ul className="admin-list">
              {albums.length === 0 ? (
                <li className="admin-list-empty">No gallery albums yet.</li>
              ) : (
                albums.map((album) => (
                  <li key={album.id} className={`admin-list-item ${selected?.id === album.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelect(album)}>
                      {album.title}
                    </button>
                    <span className="admin-badge">{album.active ? 'Visible' : 'Hidden'}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Edit album' : 'New album'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <label>
              Title
              <input type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </label>
            <label>
              Slug
              <input type="text" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </label>
            <label>
              Description
              <textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label>
              Cover image URL
              <input type="url" value={form.cover_url} onChange={(event) => setForm({ ...form, cover_url: event.target.value })} />
            </label>
            <label>
              Tags
              <input type="text" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
            </label>
            <label>
              Order
              <input type="number" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} />
            </label>
            <label className="admin-switch">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
              <span>Active</span>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save album'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default GalleryManagementPage;
