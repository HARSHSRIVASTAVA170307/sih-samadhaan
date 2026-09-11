/* Local persistence for saved schemes + recent activity (no auth needed). */

const SAVED_KEY = 'skillsetu.savedSchemes';
const ACTIVITY_KEY = 'skillsetu.activity';
const NAME_KEY = 'skillsetu.studentName';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

function read(key, fallback) {
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / disabled — ignore */
  }
}

/* -------- Saved schemes -------- */

export function getSavedSchemes() {
  return read(SAVED_KEY, []);
}

export function isSchemeSaved(id) {
  return getSavedSchemes().some((s) => s.id === id);
}

/** Toggle save state; returns the new saved flag. */
export function toggleSavedScheme(scheme) {
  const list = getSavedSchemes();
  const idx = list.findIndex((s) => s.id === scheme.id);
  let saved;
  if (idx >= 0) {
    list.splice(idx, 1);
    saved = false;
  } else {
    list.unshift({
      id: scheme.id,
      name: scheme.name,
      ministry: scheme.ministry,
      category: scheme.category,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      deadline: scheme.deadline,
      officialLink: scheme.officialLink,
      savedAt: Date.now(),
    });
    saved = true;
  }
  write(SAVED_KEY, list);
  return saved;
}

export function removeSavedScheme(id) {
  write(
    SAVED_KEY,
    getSavedSchemes().filter((s) => s.id !== id)
  );
}

/* -------- Recent activity (dashboard "recently viewed") -------- */

export function getActivity() {
  return read(ACTIVITY_KEY, []);
}

export function logActivity(type, title, target) {
  const list = getActivity();
  list.unshift({ type, title, target, at: Date.now() });
  write(ACTIVITY_KEY, list.slice(0, 12));
}

export function clearActivity() {
  write(ACTIVITY_KEY, []);
}

/* -------- Profile name (dashboard personalization) -------- */

export function getStudentName() {
  return read(NAME_KEY, '');
}

export function setStudentName(name) {
  write(NAME_KEY, name);
}
