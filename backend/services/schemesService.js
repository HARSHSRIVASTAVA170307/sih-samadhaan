const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'schemes.json');

/* Schemes are read from disk on each request in dev so the JSON file can be
   edited without a restart; cached in production. */
let cache = null;
let cacheLoaded = false;

function loadSchemes() {
  if (process.env.NODE_ENV === 'production' && cacheLoaded) return cache;
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  cache = JSON.parse(raw);
  cacheLoaded = true;
  return cache;
}

/* Public list of valid categories (used by the frontend filter UI too) */
const CATEGORIES = [
  'Scholarship',
  'Internship',
  'Skill Development',
  'Employment',
  'Entrepreneurship',
  'Students',
];

/**
 * List schemes with optional search / category filter / pagination.
 * query: { q, category, page, pageSize, sort }
 */
function listSchemes(query = {}) {
  let items = loadSchemes();

  const q = (query.q || '').trim().toLowerCase();
  if (q) {
    items = items.filter((s) =>
      [s.name, s.ministry, s.description, s.category, s.eligibility, s.benefits]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }

  const category = (query.category || '').trim();
  if (category && CATEGORIES.includes(category)) {
    items = items.filter((s) => s.category === category);
  }

  /* Keep original (curated) order by default; oldest-first otherwise */
  if (query.sort === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name));
  } else if (query.sort === 'ministry') {
    items = [...items].sort((a, b) => a.ministry.localeCompare(b.ministry));
  }

  const total = items.length;

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize, 10) || 24));
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    count: paged.length,
    data: paged,
  };
}

function getSchemeById(id) {
  return loadSchemes().find((s) => s.id === id) || null;
}

function getCategories() {
  return CATEGORIES;
}

function getStats() {
  const items = loadSchemes();
  const byCategory = {};
  for (const s of items) {
    byCategory[s.category] = (byCategory[s.category] || 0) + 1;
  }
  return {
    total: items.length,
    byCategory,
    ministries: new Set(items.map((s) => s.ministry)).size,
  };
}

module.exports = { listSchemes, getSchemeById, getCategories, getStats };
