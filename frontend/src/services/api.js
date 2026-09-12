/* API service layer — every backend call goes through here. */

/* In dev, calls are relative and go through the Vite proxy.
   In production (Vercel), set VITE_API_BASE to the Render backend URL. */
const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, { credentials: 'include', ...options });
  } catch {
    throw new Error(
      'Cannot reach the server. Please make sure the backend is running on port 4000.'
    );
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

/* ---------------- Schemes ---------------- */

export function fetchSchemes({ q = '', category = '', page = 1 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  params.set('page', String(page));
  return request(`/api/schemes?${params.toString()}`);
}

export function fetchScheme(id) {
  return request(`/api/schemes/${encodeURIComponent(id)}`);
}

export function fetchSchemeStats() {
  return request('/api/schemes/stats');
}

/* ---------------- Resume analyzer ---------------- */

export function fetchTargetJobs(q = '') {
  const params = q ? `?q=${encodeURIComponent(q)}` : '';
  return request(`/api/resume/jobs${params}`);
}

export function analyzeResume(file, jobDescription) {
  const form = new FormData();
  form.append('resume', file);
  form.append('jobDescription', jobDescription);
  return request('/api/resume/analyze', {
    method: 'POST',
    body: form,
  });
}

/* ---------------- Roadmap ---------------- */

export function fetchClarity(assessment) {
  return request('/api/roadmap/clarity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment),
  });
}

export function generateRoadmap(profile) {
  return request('/api/roadmap/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
}

/* ---------------- Auth (signup / login) ---------------- */

export function signup(details) {
  return request('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return request('/api/auth/me');
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

/* ---------------- Health ---------------- */

export function fetchHealth() {
  return request('/api/health');
}
