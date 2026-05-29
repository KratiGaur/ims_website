import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchAdmins, saveAdmin, fetchRoles } from '../services/users';

function UserManagementPage() {
  const { csrfToken } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role_id: 0, status: 1, password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [adminResponse, roleResponse] = await Promise.all([fetchAdmins(), fetchRoles()]);
      setAdmins(adminResponse.data || []);
      setRoles(roleResponse.data || []);
      setForm((prev) => ({ ...prev, role_id: roleResponse.data?.[0]?.id ?? prev.role_id }));
    } catch (err) {
      setError(err.message || 'Unable to load users and roles.');
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

  const handleSelect = (admin) => {
    setSelected(admin);
    setForm({
      name: admin.name,
      email: admin.email,
      role_id: admin.role_id,
      status: admin.status,
      password: '',
    });
    setMessage('');
  };

  const handleNew = () => {
    setSelected(null);
    setForm({ name: '', email: '', role_id: roles[0]?.id ?? 0, status: 1, password: '' });
    setMessage('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');
    try {
      const token = await ensureCsrfToken();
      await saveAdmin(
        {
          id: selected?.id,
          name: form.name,
          email: form.email,
          role_id: form.role_id,
          status: form.status,
          password: form.password,
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Admin user saved.');
      await loadData();
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Unable to save admin user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Users</p>
          <h1 className="page-title">User and role management</h1>
          <p className="page-copy">Create admin accounts, assign roles, and manage access.</p>
        </div>
      </div>
      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Admin users</h2>
            <button type="button" className="admin-button admin-button-secondary" onClick={handleNew}>
              Add admin
            </button>
          </div>
          {loading ? (
            <p>Loading admins…</p>
          ) : (
            <ul className="admin-list">
              {admins.length === 0 ? (
                <li className="admin-list-empty">No admins found.</li>
              ) : (
                admins.map((admin) => {
                  return (
                    <li key={admin.id} className={`admin-list-item ${selected?.id === admin.id ? 'active' : ''}`}>
                      <button type="button" className="admin-link-button" onClick={() => handleSelect(admin)}>
                        {admin.name}
                      </button>
                      <span className="admin-badge">{admin.email}</span>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Edit admin' : 'New admin'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <label>
              Name
              <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <label>
              Role
              <select value={form.role_id} onChange={(event) => setForm({ ...form, role_id: Number(event.target.value) })}>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </label>
            <label>
              Password {selected ? '(leave blank to keep current)' : ''}
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            <label className="admin-switch">
              <input type="checkbox" checked={form.status === 1} onChange={(event) => setForm({ ...form, status: event.target.checked ? 1 : 0 })} />
              <span>Active</span>
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save user'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default UserManagementPage;
