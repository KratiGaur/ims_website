import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchGalleryData, saveGalleryEntity, deleteGalleryEntity } from '../services/content';

function GalleryManagementPage() {
  const { csrfToken } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [albumForm, setAlbumForm] = useState({ title: '', slug: '', description: '', cover_url: '', tags: '', order: 0, active: true });
  const [itemForm, setItemForm] = useState({ album_id: 0, title: '', url: '', thumbnail_url: '', media_type: 'image', tags: '', order: 0, active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGalleryData();
      const nextAlbums = response.data || [];
      setAlbums(nextAlbums);
      return nextAlbums;
    } catch (err) {
      setError(err.message || 'Unable to load gallery data.');
      return [];
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

  const selectedAlbumItems = useMemo(() => selectedAlbum?.items || [], [selectedAlbum]);

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    setSelectedItem(null);
    setAlbumForm({
      title: album.title,
      slug: album.slug,
      description: album.description || '',
      cover_url: album.cover_url || '',
      tags: album.tags || '',
      order: album.order || 0,
      active: Boolean(album.active),
    });
    setItemForm((prev) => ({
      ...prev,
      album_id: album.id,
      order: album.items?.length || 0,
    }));
    setMessage('');
  };

  const handleNewAlbum = () => {
    setSelectedAlbum(null);
    setSelectedItem(null);
    setAlbumForm({ title: '', slug: '', description: '', cover_url: '', tags: '', order: albums.length + 1, active: true });
    setMessage('');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setItemForm({
      album_id: selectedAlbum?.id || item.album_id || 0,
      title: item.title || '',
      url: item.url || '',
      thumbnail_url: item.thumbnail_url || '',
      media_type: item.media_type || 'image',
      tags: item.tags || '',
      order: item.order || 0,
      active: Boolean(item.active),
    });
    setMessage('');
  };

  const handleNewItem = () => {
    setSelectedItem(null);
    setItemForm({
      album_id: selectedAlbum?.id || albums[0]?.id || 0,
      title: '',
      url: '',
      thumbnail_url: '',
      media_type: 'image',
      tags: '',
      order: selectedAlbumItems.length,
      active: true,
    });
    setMessage('');
  };

  const handleSaveAlbum = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const token = await ensureCsrfToken();
      await saveGalleryEntity(
        {
          entity: 'album',
          id: selectedAlbum?.id,
          title: albumForm.title,
          slug: albumForm.slug,
          description: albumForm.description,
          cover_url: albumForm.cover_url,
          tags: albumForm.tags,
          order: albumForm.order,
          active: albumForm.active,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Gallery album saved.');
      await loadGallery();
      setSelectedAlbum(null);
      setSelectedItem(null);
    } catch (err) {
      setError(err.message || 'Unable to save gallery album.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!selectedAlbum) {
      return;
    }

    if (!window.confirm(`Delete album "${selectedAlbum.title}"? This will also remove its items.`)) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage('');
    try {
      const token = await ensureCsrfToken();
      await deleteGalleryEntity(
        { entity: 'album', id: selectedAlbum.id },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Gallery album deleted.');
      setSelectedAlbum(null);
      setSelectedItem(null);
      await loadGallery();
    } catch (err) {
      setError(err.message || 'Unable to delete gallery album.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const token = await ensureCsrfToken();
      await saveGalleryEntity(
        {
          entity: 'item',
          id: selectedItem?.id,
          album_id: itemForm.album_id,
          title: itemForm.title,
          url: itemForm.url,
          thumbnail_url: itemForm.thumbnail_url,
          media_type: itemForm.media_type,
          tags: itemForm.tags,
          order: itemForm.order,
          active: itemForm.active,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Gallery item saved.');
      const updatedAlbums = await loadGallery();
      const refreshedAlbum = updatedAlbums.find((album) => album.id === Number(itemForm.album_id)) || null;
      if (refreshedAlbum) {
        setSelectedAlbum(refreshedAlbum);
      }
      setSelectedItem(null);
    } catch (err) {
      setError(err.message || 'Unable to save gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) {
      return;
    }

    if (!window.confirm(`Delete item "${selectedItem.title}"?`)) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage('');
    try {
      const token = await ensureCsrfToken();
      await deleteGalleryEntity(
        { entity: 'item', id: selectedItem.id },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Gallery item deleted.');
      setSelectedItem(null);
      await loadGallery();
    } catch (err) {
      setError(err.message || 'Unable to delete gallery item.');
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
          <p className="page-copy">Create albums, manage gallery items, and keep public galleries in sync.</p>
        </div>
        <button type="button" className="admin-button admin-button-secondary" onClick={handleNewAlbum}>
          Add album
        </button>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Albums</h2>
            <span className="admin-badge">{albums.length} total</span>
          </div>
          {loading ? (
            <p>Loading albums...</p>
          ) : (
            <ul className="admin-list">
              {albums.length === 0 ? (
                <li className="admin-list-empty">No gallery albums yet.</li>
              ) : (
                albums.map((album) => (
                  <li key={album.id} className={`admin-list-item ${selectedAlbum?.id === album.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelectAlbum(album)}>
                      <strong>{album.title}</strong>
                      <span style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        {album.slug}
                      </span>
                    </button>
                    <span className="admin-badge">{album.active ? 'Visible' : 'Hidden'}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selectedAlbum ? 'Edit album' : 'New album'}</h2>
          <form onSubmit={handleSaveAlbum} className="admin-form">
            <label>
              Title
              <input type="text" value={albumForm.title} onChange={(event) => setAlbumForm({ ...albumForm, title: event.target.value })} required />
            </label>
            <label>
              Slug
              <input type="text" value={albumForm.slug} onChange={(event) => setAlbumForm({ ...albumForm, slug: event.target.value })} />
            </label>
            <label>
              Description
              <textarea rows={4} value={albumForm.description} onChange={(event) => setAlbumForm({ ...albumForm, description: event.target.value })} />
            </label>
            <label>
              Cover image URL
              <input type="url" value={albumForm.cover_url} onChange={(event) => setAlbumForm({ ...albumForm, cover_url: event.target.value })} />
            </label>
            <label>
              Tags
              <input type="text" value={albumForm.tags} onChange={(event) => setAlbumForm({ ...albumForm, tags: event.target.value })} />
            </label>
            <label>
              Order
              <input type="number" value={albumForm.order} onChange={(event) => setAlbumForm({ ...albumForm, order: Number(event.target.value) })} />
            </label>
            <label className="admin-switch">
              <input type="checkbox" checked={albumForm.active} onChange={(event) => setAlbumForm({ ...albumForm, active: event.target.checked })} />
              <span>Active</span>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save album'}
            </button>
            {selectedAlbum ? (
              <button type="button" className="admin-button admin-button-secondary" onClick={handleDeleteAlbum} disabled={saving}>
                Delete album
              </button>
            ) : null}
          </form>
        </section>
      </div>

      <div style={{ height: 24 }} />

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Album items</h2>
            <button type="button" className="admin-button admin-button-secondary" onClick={handleNewItem} disabled={!selectedAlbum && albums.length === 0}>
              Add item
            </button>
          </div>
          {!selectedAlbum ? (
            <p>Select an album to manage its items.</p>
          ) : (
            <ul className="admin-list">
              {selectedAlbumItems.length === 0 ? (
                <li className="admin-list-empty">No items in this album yet.</li>
              ) : (
                selectedAlbumItems.map((item) => (
                  <li key={item.id} className={`admin-list-item ${selectedItem?.id === item.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelectItem(item)}>
                      <strong>{item.title}</strong>
                      <span style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        {item.media_type} • {item.url}
                      </span>
                    </button>
                    <span className="admin-badge">{item.active ? 'Visible' : 'Hidden'}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selectedItem ? 'Edit item' : 'New item'}</h2>
          <form onSubmit={handleSaveItem} className="admin-form">
            <label>
              Album
              <select value={itemForm.album_id} onChange={(event) => setItemForm({ ...itemForm, album_id: Number(event.target.value) })} required>
                <option value={0}>Select album</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input type="text" value={itemForm.title} onChange={(event) => setItemForm({ ...itemForm, title: event.target.value })} required />
            </label>
            <label>
              Media URL
              <input type="url" value={itemForm.url} onChange={(event) => setItemForm({ ...itemForm, url: event.target.value })} required />
            </label>
            <label>
              Thumbnail URL
              <input type="url" value={itemForm.thumbnail_url} onChange={(event) => setItemForm({ ...itemForm, thumbnail_url: event.target.value })} />
            </label>
            <label>
              Media type
              <select value={itemForm.media_type} onChange={(event) => setItemForm({ ...itemForm, media_type: event.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </label>
            <label>
              Tags
              <input type="text" value={itemForm.tags} onChange={(event) => setItemForm({ ...itemForm, tags: event.target.value })} />
            </label>
            <label>
              Order
              <input type="number" value={itemForm.order} onChange={(event) => setItemForm({ ...itemForm, order: Number(event.target.value) })} />
            </label>
            <label className="admin-switch">
              <input type="checkbox" checked={itemForm.active} onChange={(event) => setItemForm({ ...itemForm, active: event.target.checked })} />
              <span>Active</span>
            </label>
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save item'}
            </button>
            {selectedItem ? (
              <button type="button" className="admin-button admin-button-secondary" onClick={handleDeleteItem} disabled={saving}>
                Delete item
              </button>
            ) : null}
          </form>
        </section>
      </div>
    </div>
  );
}

export default GalleryManagementPage;
