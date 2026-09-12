/*
 * Auth routes — simple, dependency-free session auth for the prototype:
 *
 *   POST /api/auth/signup   { fullName, email, password, college?, course?,
 *                             graduationYear?, skills? }  -> creates account
 *   POST /api/auth/login    { email, password }             -> session cookie
 *   GET  /api/auth/me                                       -> current user
 *   POST /api/auth/logout                                   -> clears session
 *
 * Sessions: random 32-byte token held in an httpOnly cookie (1 week).
 * The frontend never sees the token; cookies ride along automatically
 * (same-origin in dev via the Vite proxy, credentials: 'include' configured).
 *
 * For SIH judging this is intentionally simple — swap the token map for
 * signed JWTs or a session table when moving to a real deployment.
 */

const express = require('express');
const crypto = require('crypto');
const users = require('../services/usersService');

const router = express.Router();

/* token -> user id (prototype scope; survives until backend restart) */
const sessions = new Map();

const COOKIE_NAME = 'skillsetu_session';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_MS / 1000}`
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function getSessionUser(req) {
  const header = req.headers.cookie || '';
  const match = header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const token = match.slice(COOKIE_NAME.length + 1);
  const userId = sessions.get(token);
  if (!userId) return null;
  const user = users.findById(userId);
  return user ? { user, token } : null;
}

/* ---------------- routes ---------------- */

router.post('/signup', (req, res) => {
  try {
    const user = users.createUser(req.body || {});
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, user.id);
    setSessionCookie(res, token);
    res.status(201).json({ user });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Signup failed.' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.verifyCredentials(email, password);
  if (!user) {
    return res
      .status(401)
      .json({ error: 'Incorrect email or password. Please try again.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, user.id);
  setSessionCookie(res, token);
  res.json({ user });
});

router.get('/me', (req, res) => {
  const session = getSessionUser(req);
  /* 200 with user:null (instead of 401) keeps the browser console clean when
     visitors are simply not logged in. */
  res.json({ user: session ? users.toPublic(session.user) : null });
});

router.post('/logout', (req, res) => {
  const session = getSessionUser(req);
  if (session) sessions.delete(session.token);
  clearSessionCookie(res);
  res.json({ ok: true });
});

module.exports = { router, getSessionUser };
