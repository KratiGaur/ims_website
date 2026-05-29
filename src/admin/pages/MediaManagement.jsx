import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchMediaList, uploadMedia, updateMedia } from '../services/media';

function MediaManagementPage() {
  const { csrfToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'general', tags: '', type: 'media' });
  const [file, setFile] = useState(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMediaList();
      setItems(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load media items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Choose a file to upload.');
      return;
    }
    setUploading(true);
    setError(null);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title || file.name);
    formData.append('type', form.type);
    formData.append('category', form.category);
    formData.append('tags', form.tags);

    try {
      const token = await ensureCsrfToken();
      await uploadMedia(formData, { headers: { 'X-CSRF-Token': token } });
      setMessage('Uploaded successfully.');
      setFile(null);
      setForm({ title: '', category: 'general', tags: '', type: 'media' });
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (item) => {
    setError(null);
    try {
      const token = await ensureCsrfToken();
      await updateMedia(
        { id: item.id, title: item.title, category: item.category, tags: item.tags, active: item.active ? 0 : 1 },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Media item updated.');
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Unable to update media item.');
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Media</p>
          <h1 className="page-title">Media management</h1>
          <p className="page-copy">Upload files, organize tags, and publish or archive media items.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <h2>Upload media</h2>
          <form onSubmit={handleUpload} className="admin-form">
            <label>
              File
              <input type="file" accept="image/*,video/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
            <label>
              Title
              <input type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Media title" />
            </label>
            <label>
              Category
              <input type="text" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </label>
            <label>
              Tags
              <input type="text" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="comma-separated" />
            </label>
            <label>
              Type
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="media">Other</option>
              </select>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload media'}
            </button>
          </form>
        </section>

        <section className="glass-card admin-panel-card">
          <h2>Media library</h2>
          {loading ? (
            <p>Loading media library...</p>
          ) : (
            <ul className="admin-list admin-media-list">
              {items.length === 0 ? (
                <li className="admin-list-empty">No media has been uploaded yet.</li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className="admin-list-item admin-media-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.type} • {item.category}</p>
                      <a href={item.url} target="_blank" rel="noreferrer">View file</a>
                    </div>
                    <button type="button" className="admin-button admin-button-secondary" onClick={() => handleToggleActive(item)}>
                      {item.active ? 'Archive' : 'Publish'}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default MediaManagementPage;
