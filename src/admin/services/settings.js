import { fetchJson } from './api';

export function fetchSystemSettings() {
  return fetchJson('settings/index.php');
}

export function saveSystemSetting(payload, options = {}) {
  return fetchJson('settings/index.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}
