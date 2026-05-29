import { fetchJson } from './api';

export function login(email, password) {
  return fetchJson('auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return fetchJson('auth/logout.php', {
    method: 'POST',
  });
}

export function checkSession() {
  return fetchJson('auth/check_session.php', {
    method: 'GET',
  });
}
