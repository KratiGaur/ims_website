import { fetchJson } from './api';

export function fetchHomepageSections() {
  return fetchJson('content/homepage.php');
}

export function saveHomepageSection(payload, options = {}) {
  return fetchJson('content/homepage.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function fetchPageBlocks(pageKey) {
  return fetchJson(`content/page.php?page_key=${encodeURIComponent(pageKey)}`);
}

export function savePageBlock(payload, options = {}) {
  return fetchJson('content/page.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function fetchCommitteeMembers() {
  return fetchJson('content/committee.php');
}

export function saveCommitteeMember(payload, options = {}) {
  return fetchJson('content/committee.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function deleteCommitteeMember(id, options = {}) {
  return fetchJson('content/committee.php', {
    method: 'POST',
    body: JSON.stringify({ id, action: 'delete' }),
    ...options,
  });
}

export function fetchGalleryData() {
  return fetchJson('content/gallery.php');
}

export function saveGalleryEntity(payload, options = {}) {
  return fetchJson('content/gallery.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function deleteGalleryEntity(payload, options = {}) {
  return fetchJson('content/gallery.php', {
    method: 'POST',
    body: JSON.stringify({ ...payload, action: 'delete' }),
    ...options,
  });
}

export function fetchAbstracts() {
  return fetchJson('content/abstracts.php');
}

export function updateAbstract(payload, options = {}) {
  return fetchJson('content/abstracts.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function fetchRegistrations() {
  return fetchJson('content/registrations.php');
}

export function updateRegistration(payload, options = {}) {
  return fetchJson('content/registrations.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}

export function fetchSeoSettings(pageKey) {
  return fetchJson(`content/seo.php?page_key=${encodeURIComponent(pageKey)}`);
}

export function saveSeoSetting(payload, options = {}) {
  return fetchJson('content/seo.php', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  });
}
