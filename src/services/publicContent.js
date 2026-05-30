const PUBLIC_API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api/content`;

function buildUrl(path) {
  return `${PUBLIC_API_BASE}/${path}`;
}

async function parseResponse(response) {
  const text = await response.text();

  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error('Unexpected response from server.');
    }
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

export async function fetchPublicPageBlocks(pageKey) {
  const response = await fetch(buildUrl(`page.php?page_key=${encodeURIComponent(pageKey)}`), {
    headers: {
      Accept: 'application/json',
    },
  });

  return parseResponse(response);
}

export async function fetchPublicMediaItems() {
  const response = await fetch(buildUrl('media.php'), {
    headers: {
      Accept: 'application/json',
    },
  });

  return parseResponse(response);
}

export async function fetchPublicGalleryAlbums() {
  const response = await fetch(buildUrl('gallery.php'), {
    headers: {
      Accept: 'application/json',
    },
  });

  return parseResponse(response);
}
