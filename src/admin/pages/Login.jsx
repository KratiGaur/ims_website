import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { user, login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const from = (location.state && location.state.from && location.state.from.pathname) || '/admin/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    await login(email.trim(), password);
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1>Admin Sign In</h1>
        <p className="admin-login-subtitle">Secure access to YROC 2027 CMS dashboard.</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              placeholder="admin@yroc13.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>
          {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
          <button type="submit" className="admin-button admin-button-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
