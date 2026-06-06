import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../services/csrf';
import { fetchRegistrations, updateRegistration } from '../services/content';

function RegistrationManagementPage() {
  const { csrfToken } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
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

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const searchable = `${item.full_name} ${item.institution} ${item.email} ${item.registration_type}`.toLowerCase();
      const matchesSearch = searchable.includes(searchTerm.toLowerCase());
      const matchesPayment = paymentFilter === 'all' || item.payment_status === paymentFilter;
      const matchesAttendance = attendanceFilter === 'all' || item.attendance_status === attendanceFilter;

      return matchesSearch && matchesPayment && matchesAttendance;
    });
  }, [registrations, searchTerm, paymentFilter, attendanceFilter]);

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
      await updateRegistration(
        {
          id: selected.id,
          payment_status: selected.payment_status,
          attendance_status: selected.attendance_status,
          qr_code: selected.qr_code || '',
        },
        { headers: { 'X-CSRF-Token': token } }
      );
      setMessage('Registration updated.');
      await loadRegistrations();
    } catch (err) {
      setError(err.message || 'Unable to update registration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-shell">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Registration</p>
          <h1 className="page-title">Registration management</h1>
          <p className="page-copy">Track registrations, payment status, and attendance for attendees.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-two-columns">
        <section className="glass-card admin-panel-card">
          <div className="panel-header">
            <h2>Attendees</h2>
            <span className="admin-badge">{filteredRegistrations.length} shown</span>
          </div>
          <div className="admin-form" style={{ marginBottom: 16 }}>
            <label>
              Search
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Name, email, institution..."
              />
            </label>
            <label>
              Payment
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
                <option value="all">All payments</option>
                <option value="pending">pending</option>
                <option value="completed">completed</option>
                <option value="failed">failed</option>
              </select>
            </label>
            <label>
              Attendance
              <select value={attendanceFilter} onChange={(event) => setAttendanceFilter(event.target.value)}>
                <option value="all">All attendance</option>
                <option value="registered">registered</option>
                <option value="checked_in">checked_in</option>
                <option value="no_show">no_show</option>
              </select>
            </label>
          </div>
          {loading ? (
            <p>Loading registration records...</p>
          ) : (
            <ul className="admin-list">
              {filteredRegistrations.length === 0 ? (
                <li className="admin-list-empty">No registrations yet.</li>
              ) : (
                filteredRegistrations.map((item) => (
                  <li key={item.id} className={`admin-list-item ${selected?.id === item.id ? 'active' : ''}`}>
                    <button type="button" className="admin-link-button" onClick={() => handleSelect(item)}>
                      <strong>{item.full_name}</strong>
                      <span style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        {item.email} • {item.registration_type}
                      </span>
                    </button>
                    <span className="admin-badge">{item.payment_status}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="glass-card admin-panel-card">
          <h2>{selected ? 'Edit registration' : 'Select a registration'}</h2>
          {selected ? (
            <form onSubmit={handleSave} className="admin-form">
              <div className="section-card" style={{ padding: 16, background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ margin: '0 0 8px' }}><strong>{selected.full_name}</strong></p>
                <p style={{ margin: '0 0 6px' }}>{selected.email}</p>
                <p style={{ margin: '0 0 6px' }}>{selected.institution}</p>
                <p style={{ margin: 0 }}>{selected.specialization} • {selected.registration_type}</p>
              </div>
              <label>
                Payment status
                <select value={selected.payment_status} onChange={(event) => setSelected({ ...selected, payment_status: event.target.value })}>
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                  <option value="failed">failed</option>
                </select>
              </label>
              <label>
                Attendance status
                <select value={selected.attendance_status} onChange={(event) => setSelected({ ...selected, attendance_status: event.target.value })}>
                  <option value="registered">registered</option>
                  <option value="checked_in">checked_in</option>
                  <option value="no_show">no_show</option>
                </select>
              </label>
              <label>
                QR code
                <input type="text" value={selected.qr_code || ''} onChange={(event) => setSelected({ ...selected, qr_code: event.target.value })} />
              </label>
              {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
              {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}
              <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save registration'}
              </button>
            </form>
          ) : (
            <p>Select a registration to update payment and attendance status.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default RegistrationManagementPage;
