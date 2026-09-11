const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'jobDescriptions.json');

let cache = null;
let cacheLoaded = false;

function loadJobs() {
  if (process.env.NODE_ENV === 'production' && cacheLoaded) return cache;
  cache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  cacheLoaded = true;
  return cache;
}

function listJobs(q = '') {
  const items = loadJobs();
  const query = q.trim().toLowerCase();
  if (!query) return items;
  return items.filter((j) =>
    [j.company, j.role, j.location, j.about, ...(j.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(query)
  );
}

function getJobById(id) {
  return loadJobs().find((j) => j.id === id) || null;
}

module.exports = { listJobs, getJobById };
