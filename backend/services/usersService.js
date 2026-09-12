/*
 * User store for the signup/login system.
 *
 * Storage: backend/data/users.json (same JSON-first approach as schemes —
 * swappable for a real DB later without touching the routes).
 *
 * Passwords are NEVER stored in plain text: each user gets a random 16-byte
 * salt and a scrypt hash (Node's built-in crypto — no external dependency).
 * Login verification uses timing-safe comparison.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

/* ---------------- low-level store ---------------- */

function ensureStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readUsers() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  ensureStore();
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE); // atomic on same volume
}

/* ---------------- password hashing ---------------- */

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

/* ---------------- public API ---------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Normalized public shape — never includes the password fields. */
function toPublic(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    college: user.college || '',
    course: user.course || '',
    graduationYear: user.graduationYear || '',
    skills: user.skills || '',
    createdAt: user.createdAt,
  };
}

function findByEmail(email) {
  const needle = String(email || '').trim().toLowerCase();
  return readUsers().find((u) => u.email === needle) || null;
}

function findById(id) {
  return readUsers().find((u) => u.id === id) || null;
}

/**
 * Create a user. Throws Error with .status on validation conflicts.
 * `profile` may include college, course, graduationYear, skills.
 */
function createUser({ fullName, email, password, ...profile }) {
  const name = String(fullName || '').trim();
  const mail = String(email || '').trim().toLowerCase();
  const pass = String(password || '');

  if (name.length < 2) {
    const e = new Error('Please enter your full name (at least 2 characters).');
    e.status = 400;
    throw e;
  }
  if (!EMAIL_RE.test(mail)) {
    const e = new Error('Please enter a valid email address.');
    e.status = 400;
    throw e;
  }
  if (pass.length < 6) {
    const e = new Error('Password must be at least 6 characters long.');
    e.status = 400;
    throw e;
  }
  if (findByEmail(mail)) {
    const e = new Error('An account with this email already exists. Please log in instead.');
    e.status = 409;
    throw e;
  }

  const user = {
    id: crypto.randomUUID(),
    fullName: name,
    email: mail,
    passwordHash: hashPassword(pass),
    college: String(profile.college || '').trim(),
    course: String(profile.course || '').trim(),
    graduationYear: String(profile.graduationYear || '').trim(),
    skills: String(profile.skills || '').trim(),
    createdAt: new Date().toISOString(),
  };

  const users = readUsers();
  users.push(user);
  writeUsers(users);

  return toPublic(user);
}

/** Verify credentials; returns the public user or null. */
function verifyCredentials(email, password) {
  const user = findByEmail(email);
  if (!user) return null;
  const ok = verifyPassword(String(password || ''), user.passwordHash);
  return ok ? toPublic(user) : null;
}

/** Total registered users (for dashboard/health stats). */
function countUsers() {
  return readUsers().length;
}

module.exports = {
  createUser,
  verifyCredentials,
  findByEmail,
  findById,
  toPublic,
  countUsers,
};
