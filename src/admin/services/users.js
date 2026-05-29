import { fetchJson } from './api';

export function fetchAdmins() {
  return fetchJson('users/index.php');
}

export function saveAdmin(payload, options = {}) {
  return fetchJson('users/index.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function fetchRoles() {
  return fetchJson('users/index.php?roles=1');
}
