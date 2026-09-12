/* Career profile — the visitor's skills, interests, target career and timeline.
 * Shown in the first-visit onboarding window and on the Dashboard profile card.
 * Seeded from the account's profile fields at signup/login when available.
 */

import { getStudentName } from './localStore.js';

const PROFILE_KEY = 'skillsetu.careerProfile';
const SEEN_KEY = 'skillsetu.onboarded';

export const CAREER_TARGETS = [
  'Software Engineer (SDE)',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'Full Stack Web Developer',
  'Frontend Developer',
  'Backend Developer',
  'App Developer (Android/iOS)',
  'Cloud / DevOps Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Product Manager',
  'I am still exploring',
];

export const SKILL_SUGGESTIONS = [
  'Python', 'Java', 'C/C++', 'JavaScript', 'React', 'Node.js', 'SQL',
  'HTML/CSS', 'Data Structures', 'Machine Learning', 'Git', 'Excel',
];

export const INTEREST_SUGGESTIONS = [
  'Web development', 'AI / Machine Learning', 'Data Science', 'App development',
  'Cloud & DevOps', 'Cybersecurity', 'UI/UX design', 'Competitive programming',
  'Open source', 'Entrepreneurship',
];

export const TIMELINE_OPTIONS = [
  '3 months',
  '6 months',
  '12 months',
  'Just exploring',
];

export function emptyProfile() {
  return { skills: '', interests: '', targetCareer: '', timeline: '6 months', updatedAt: 0 };
}

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile();
    return { ...emptyProfile(), ...JSON.parse(raw) };
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(p) {
  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ ...emptyProfile(), ...p, updatedAt: Date.now() })
    );
  } catch {
    /* storage unavailable — ignore */
  }
}

export function isOnboarded() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Pull account fields (college/course/skills) into the local profile once. */
export function seedFromAccount(user) {
  if (!user) return;
  const p = getProfile();
  const seed = {};
  if (!p.skills && user.skills) seed.skills = user.skills;
  if (!p.targetCareer && user.course) {
    // Course hints at a direction only if it looks career-like — keep simple:
    // we just don't overwrite. Skills are the valuable seed here.
  }
  if (Object.keys(seed).length) saveProfile({ ...p, ...seed });
}

/** Compose the roadmap-prefill payload from the stored profile. */
export function toRoadmapForm() {
  const p = getProfile();
  const name = getStudentName() || '';
  return {
    name,
    skills: p.skills || '',
    interests: p.interests || '',
    goals: p.targetCareer ? `Become a ${p.targetCareer}` : '',
    time_per_week: 10,
    learning_pace: 'medium',
    education: 'Bachelors (B.Tech / B.E. / BSc / BCA)',
  };
}
