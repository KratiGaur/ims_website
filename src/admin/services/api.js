const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api/admin`;

function buildUrl(path) {
  return `${API_BASE}/${path}`;
}

function parseResponse(response) {
  return response.json().then((data) => {
    if (!response.ok && !data.success) {
      return Promise.reject(data);
    }
    return data;
  });
}

function getCsrfTokenFromGlobal() {
  // Minimal-change bridge: AuthContext populates `window.__ADMIN_CSRF_TOKEN__`.
  // If missing (initial load), requests still proceed and backend will reject with 403.
  return window.__ADMIN_CSRF_TOKEN__ || null;
}

function withCsrfHeader(options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (!needsCsrf) return options;

  const token = getCsrfTokenFromGlobal();
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { 'X-CSRF-Token': token } : {}),
    },
  };
}

export async function fetchJson(path, options = {}) {
  const finalOptions = withCsrfHeader(options);
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(finalOptions.headers || {}),
    },
    ...finalOptions,
  });

  return parseResponse(response);
}

export async function fetchFormData(path, formData, options = {}) {
  const finalOptions = withCsrfHeader({ method: options.method || 'POST', ...options });
  const response = await fetch(buildUrl(path), {
    ...finalOptions,
    credentials: 'include',
    body: formData,
  });

  return parseResponse(response);
}

