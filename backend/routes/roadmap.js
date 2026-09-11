const express = require('express');
const { generateRoadmap, calculateClarityScore } = require('../services/integration');

const router = express.Router();

/**
 * POST /api/roadmap/clarity
 * SkillRoute's rule-based clarity scoring (no AI call).
 */
router.post('/clarity', (req, res) => {
  const a = req.body || {};
  const valid = ['yes', 'somewhat', 'no'];
  const validFam = ['very', 'somewhat', 'not_at_all'];
  const validGoal = ['internship', 'full_time_job', 'learning', 'exploring'];

  if (!valid.includes(a.has_career_in_mind) || !validFam.includes(a.familiarity_with_paths) || !validGoal.includes(a.primary_goal)) {
    res.status(400).json({ error: 'Invalid assessment answers.' });
    return;
  }
  res.json(calculateClarityScore(a));
});

/**
 * POST /api/roadmap/generate
 * body: { name, education, skills, interests, goals, experience?, time_per_week?, learning_pace? }
 * Runs the SkillRoute repository's roadmap agent.
 */
router.post('/generate', (req, res) => {
  const b = req.body || {};

  const errors = [];
  if (!b.name || !String(b.name).trim()) errors.push('Name is required.');
  if (!b.education || !String(b.education).trim()) errors.push('Education level is required.');
  if (!b.skills || !String(b.skills).trim()) errors.push('At least one current skill is required.');
  if (!b.interests || !String(b.interests).trim()) errors.push('At least one interest is required.');
  if (!b.goals || !String(b.goals).trim()) errors.push('Career goal is required.');

  const pace = b.learning_pace || 'medium';
  if (!['slow', 'medium', 'fast'].includes(pace)) errors.push('Learning pace must be slow, medium or fast.');

  const timePerWeek = b.time_per_week === undefined || b.time_per_week === null || b.time_per_week === ''
    ? 10
    : parseInt(b.time_per_week, 10);
  if (Number.isNaN(timePerWeek) || timePerWeek < 1 || timePerWeek > 40) {
    errors.push('Weekly learning hours must be between 1 and 40.');
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(' ') });
    return;
  }

  const profile = {
    name: String(b.name).trim(),
    education: String(b.education).trim(),
    skills: String(b.skills).trim(),
    interests: String(b.interests).trim(),
    goals: String(b.goals).trim(),
    experience: b.experience ? String(b.experience).trim() : '',
    time_per_week: timePerWeek,
    learning_pace: pace,
  };

  generateRoadmap(profile)
    .then((result) => res.json({ status: 'success', profile, ...result }))
    .catch((e) => {
      res.status(e.status || 500).json({ error: e.message || 'Roadmap generation failed.' });
    });
});

module.exports = router;
