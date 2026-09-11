/*
 * Integration layer for the two reference repositories:
 *
 * 1. AI Resume Match Analyzer  (resume-analyzer/, FastAPI + Gemini)
 *    - Called over HTTP at RESUME_ANALYZER_URL (POST /analyze).
 *    - The upstream service returns a plain-text structured report; this layer
 *      parses it into structured sections for the React UI.
 *
 * 2. SkillRoute roadmap engine (roadmap/backend, FastAPI + Groq)
 *    - Its agent logic is imported directly as a Python library
 *      (see services/roadmap_bridge.py), reusing generate_roadmap() from the
 *      repository untouched, while bypassing its Firebase-only auth/storage.
 */

const { RESUME_ANALYZER_URL } = require('../config');

const UPSTREAM_TIMEOUT_MS = 120000; // LLM calls can be slow

async function fetchWithTimeout(url, options = {}, timeout = UPSTREAM_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Resume analyzer integration                                         */
/* ------------------------------------------------------------------ */

async function checkResumeAnalyzer() {
  try {
    const res = await fetchWithTimeout(
      `${RESUME_ANALYZER_URL}/health`,
      { method: 'GET' },
      4000
    );
    if (!res.ok) return false;
    const body = await res.json();
    return body && body.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Forward a resume PDF + job description to the Python analyzer and parse
 * its structured text report into a JSON payload for the frontend.
 */
async function analyzeResume({ file, jobDescription }) {
  const healthy = await checkResumeAnalyzer();
  if (!healthy) {
    const err = new Error(
      'The resume analyzer service is not running. Start it with: cd resume-analyzer/backend && uvicorn app.main:app --port 8001'
    );
    err.status = 503;
    throw err;
  }

  const form = new FormData();
  form.append('resume', new Blob([file.buffer], { type: 'application/pdf' }), file.originalname);
  form.append('job_description', jobDescription);

  let res;
  try {
    res = await fetchWithTimeout(`${RESUME_ANALYZER_URL}/analyze`, {
      method: 'POST',
      body: form,
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      const err = new Error('Resume analysis timed out. Please try again.');
      err.status = 504;
      throw err;
    }
    throw e;
  }

  if (!res.ok) {
    let detail = 'Resume analyzer returned an error.';
    try {
      const body = await res.json();
      if (body && body.detail) detail = body.detail;
    } catch {
      /* keep default detail */
    }
    const err = new Error(detail);
    err.status = res.status === 400 ? 400 : 502;
    throw err;
  }

  const body = await res.json();
  if (!body || typeof body.result !== 'string' || !body.result.trim()) {
    const err = new Error('Resume analyzer returned an empty result.');
    err.status = 502;
    throw err;
  }

  /* Surface the analyzer's own configuration errors clearly */
  if (/Gemini API key is missing/i.test(body.result)) {
    const err = new Error(
      'The resume analyzer service has no GEMINI_API_KEY configured. Add it to resume-analyzer/backend/.env and restart the FastAPI service.'
    );
    err.status = 503;
    throw err;
  }
  if (/^Gemini API error/i.test(body.result.trim())) {
    const err = new Error(
      `Gemini request failed inside the analyzer service: ${body.result.trim().slice(0, 200)}`
    );
    err.status = 502;
    throw err;
  }

  return parseAnalyzerReport(body.result);
}

/**
 * The upstream analyzer (repo: AI-Resume-Match-Analyzer) returns a
 * numbered plain-text report. Parse it into structured sections and derive
 * an overall score for the results dashboard.
 */
function parseAnalyzerReport(text) {
  const report = text.trim();

  const sectionKeys = [
    ['overallMatchScore', /(?:^|\n)\s*1\.\s*Overall Match Score\s*:?\s*/i],
    ['strongMatches', /(?:^|\n)\s*2\.\s*Strong Matches\s*:?\s*/i],
    ['missingOrWeakAreas', /(?:^|\n)\s*3\.\s*Missing or Weak Areas\s*:?\s*/i],
    ['atsKeywords', /(?:^|\n)\s*4\.\s*ATS Keywords to Add\s*:?\s*/i],
    ['improvementSuggestions', /(?:^|\n)\s*5\.\s*Resume Improvement Suggestions\s*:?\s*/i],
    ['improvedBullets', /(?:^|\n)\s*6\.\s*Improved Resume Bullets\s*:?\s*/i],
    ['finalRecommendation', /(?:^|\n)\s*7\.\s*Final Recommendation\s*:?\s*/i],
  ];

  const sections = {};
  for (let i = 0; i < sectionKeys.length; i += 1) {
    const [key, re] = sectionKeys[i];
    const start = report.search(re);
    if (start === -1) continue;
    const match = report.slice(start).match(re);
    const contentStart = start + (match ? match[0].length : 0);
    let contentEnd = report.length;
    if (i + 1 < sectionKeys.length) {
      const next = report.slice(contentStart).search(sectionKeys[i + 1][1]);
      if (next !== -1) contentEnd = contentStart + next;
    }
    sections[key] = report.slice(contentStart, contentEnd).trim();
  }

  const linesToItems = (textBlock) =>
    (textBlock || '')
      .split('\n')
      .map((l) => l.replace(/^[\s\-*•\d.)]+/, '').trim())
      .filter((l) => l.length > 1);

  /* Score: first number in the score section (e.g. "78/100" or "78 out of 100") */
  const scoreMatch = (sections.overallMatchScore || '').match(/(\d{1,3})\s*(?:\/\s*100|out of 100|%)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
  if (score === null) {
    const bare = (sections.overallMatchScore || '').match(/\b(\d{1,3})\b/);
    if (bare) {
      const val = parseInt(bare[1], 10);
      score = val >= 0 && val <= 100 ? val : null;
    }
  }

  /* Recommendation label */
  const rec = (sections.finalRecommendation || '').toLowerCase();
  let recommendation = 'review';
  if (rec.includes('apply now')) recommendation = 'apply-now';
  else if (rec.includes('after')) recommendation = 'apply-after-edits';
  else if (rec.includes('build more evidence')) recommendation = 'build-more-evidence';

  return {
    rawReport: report,
    score,
    summary: (sections.overallMatchScore || '')
      .replace(/^\s*\d{1,3}\s*(?:\/\s*100|out of 100|%)\s*[:.-]?\s*/i, '')
      .trim(),
    strongMatches: linesToItems(sections.strongMatches),
    missingOrWeakAreas: linesToItems(sections.missingOrWeakAreas),
    atsKeywords: linesToItems(sections.atsKeywords),
    improvementSuggestions: linesToItems(sections.improvementSuggestions),
    improvedBullets: linesToItems(sections.improvedBullets),
    finalRecommendation: sections.finalRecommendation || '',
    recommendation,
  };
}

/* ------------------------------------------------------------------ */
/* SkillRoute roadmap engine integration                               */
/* ------------------------------------------------------------------ */

const { spawnPythonBridge } = require('./roadmapBridge');

function roadmapEngineHealthy() {
  return Boolean(process.env.GROQ_API_KEY);
}

/**
 * Generate a career roadmap by running the SkillRoute repository's own
 * roadmap_agent.generate_roadmap() through the Python bridge.
 */
async function generateRoadmap(profile) {
  return spawnPythonBridge({
    action: 'generate_roadmap',
    payload: profile,
    timeoutMs: UPSTREAM_TIMEOUT_MS,
  });
}

/**
 * Rule-based career clarity scoring — SkillRoute's matching_service.
 * Implemented in JS for a snappy UI call (deterministic rules, same weights).
 */
function calculateClarityScore(assessment) {
  let score = 0;
  const careerMind = assessment.has_career_in_mind || 'no';
  if (careerMind === 'yes') score += 40;
  else if (careerMind === 'somewhat') score += 20;

  const familiarity = assessment.familiarity_with_paths || 'not_at_all';
  if (familiarity === 'very') score += 35;
  else if (familiarity === 'somewhat') score += 18;

  const goalScores = { full_time_job: 25, internship: 20, learning: 12, exploring: 5 };
  score += goalScores[assessment.primary_goal] || 5;

  let level = 'exploring';
  let message =
    "You're still exploring — the agent will analyze your profile deeply to discover the right path.";
  if (score >= 70) {
    level = 'focused';
    message = 'You have a clear direction! The agent will fine-tune the best path for you.';
  } else if (score >= 40) {
    level = 'narrowing';
    message = 'You have some idea — the agent will evaluate multiple paths and pick the best fit.';
  }

  return {
    clarity_score: Math.min(score, 100),
    clarity_level: level,
    message,
    breakdown: {
      career_direction: careerMind,
      path_familiarity: familiarity,
      goal_specificity: assessment.primary_goal,
    },
  };
}

module.exports = {
  checkResumeAnalyzer,
  analyzeResume,
  parseAnalyzerReport,
  generateRoadmap,
  calculateClarityScore,
  roadmapEngineHealthy,
  resumeAnalyzerHealthy: checkResumeAnalyzer,
};
