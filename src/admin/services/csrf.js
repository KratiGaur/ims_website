import { fetchJson } from './api';

export function getCsrfToken() {
  return fetchJson('auth/csrf.php');
}
