import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchCommitteeMembers, saveCommitteeMember, deleteCommitteeMember } from '../services/content';

function CommitteeManagementPage() {
  const { csrfToken } = useAuth();
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', bio: '', image_url: '', order: 0, active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCommitteeMembers();
      setMembers(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to fetch committee members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleEdit = (member) => {
    setSelected(member);
    setForm({
      name: member.name,
      designation: member.designation,
      bio: member.bio,
      image_url: member.image_url,
      order: member.order,
      active: member.active,
    });
    setMessage('');
  };

  const handleNew = () => {
    setSelected(null);
    setForm({ name: '', designation: '', bio: '', image_url: '', order: members.length + 1, active: true });
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const token = await ensureCsrfToken();
      await saveCommitteeMember(
        {
          id: selected?.id,
          name: form.name,
          designation: form.designation,
          bio: form.bio,
          image_url: form.image_url,
          order: form.order,
          active: form.active,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Committee member saved.');
      await loadMembers();
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Unable to save committee member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const token = await ensureCsrfToken();
      await deleteCommitteeMember(selected.id, { headers: { 'X-CSRF-Token': token } });
      setMessage('Committee member deleted.');
      await loadMembers();
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Unable to delete committee member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Committee</p>
          <h1 className="page-title">Committee management</h1>
          <p className="page-copy">Add, reorder, upload photos, and toggle visibility for committee members.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Members</h2>
            <button type="button" className="admin-button admin-button-secondary" onClick={handleNew}>
              Add member
            </button>
          </div>
          {loading ? (
            <p>Loading members…</p>
          ) : (
            <ul className="admin-list">
              {members.length === 0 ? (
                <li className="admin-list-empty">No committee members yet.</li>
              ) : (
                members.map((member) => (
                  <li key={member.id} className={`admin-list-item ${selected?.id === member.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleEdit(member)}>
                      {member.name}
                    </button>
                    <span className="admin-badge">{member.designation}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Edit member' : 'New member'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Name
              <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>
              Designation
              <input type="text" value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} required />
            </label>
            <label>
              Biography
              <textarea rows={6} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
            </label>
            <label>
              Image URL
              <input type="url" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
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
            <div className="form-actions">
              <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save member'}
              </button>
              {selected ? (
                <button type="button" className="admin-button admin-button-danger" onClick={handleDelete} disabled={saving}>
                  Delete
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CommitteeManagementPage;
