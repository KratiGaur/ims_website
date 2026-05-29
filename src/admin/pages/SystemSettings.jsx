import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchSystemSettings, saveSystemSetting } from '../services/settings';

function SystemSettingsPage() {
  const { csrfToken } = useAuth();
  const [settings, setSettings] = useState([]);
  const [form, setForm] = useState({ key: '', value: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSystemSettings();
      setSettings(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load system settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const ensureCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }
    const response = await getCsrfToken();
    return response.csrf_token;
  };

  const handleSelect = (setting) => {
    setForm({ key: setting.key, value: JSON.stringify(setting.value) });
    setMessage('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');
    let parsedValue;

    try {
      parsedValue = JSON.parse(form.value);
    } catch {
      parsedValue = form.value;
    }

    try {
      const token = await ensureCsrfToken();
      await saveSystemSetting(
        { key: form.key, value: parsedValue },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Setting saved.');
      await loadSettings();
    } catch (err) {
      setError(err.message || 'Unable to save setting.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Settings</p>
          <h1 className="page-title">System settings</h1>
          <p className="page-copy">Configure theme behavior, session timeout, and security settings.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <h2>Settings list</h2>
          {loading ? (
            <p>Loading settings…</p>
          ) : (
            <ul className="admin-list">
              {settings.length === 0 ? (
                <li className="admin-list-empty">No system settings stored yet.</li>
              ) : (
                settings.map((setting) => (
                  <li key={setting.id} className="admin-list-item">
                    <button type="button" className="admin-link-button" onClick={() => handleSelect(setting)}>
                      {setting.key}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>Edit setting</h2>
          <form onSubmit={handleSave} className="admin-form">
            <label>
              Key
              <input type="text" value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} required />
            </label>
            <label>
              Value
              <textarea rows={6} value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} placeholder='Enter JSON or plain text' />
            </label>
            {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
            {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
            <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save setting'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SystemSettingsPage;
