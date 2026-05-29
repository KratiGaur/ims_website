import { fetchJson, fetchFormData } from './api';

export function fetchMediaList() {
  return fetchJson('media/list.php');
}

export function uploadMedia(formData, options = {}) {
  return fetchFormData('media/upload.php', formData, options);
}

export function updateMedia(payload, options = {}) {
  return fetchJson('media/list.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}
