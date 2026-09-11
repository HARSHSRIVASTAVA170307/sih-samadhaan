const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeResume } = require('../services/integration');
const jobsService = require('../services/jobsService');

const router = express.Router();

/* GET /api/resume/jobs?q= — preloaded target-company job descriptions */
router.get('/jobs', (req, res) => {
  try {
    const items = jobsService.listJobs(req.query.q || '');
    res.json({ total: items.length, data: items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load job descriptions.' });
  }
});

/* GET /api/resume/jobs/:id — one job description */
router.get('/jobs/:id', (req, res) => {
  const job = jobsService.getJobById(req.params.id);
  if (!job) {
    res.status(404).json({ error: 'Job description not found', id: req.params.id });
    return;
  }
  res.json(job);
});

/* Accept PDFs up to 10 MB (the analyzer only supports PDF resumes) */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      path.extname(file.originalname).toLowerCase() === '.pdf' &&
      (file.mimetype === 'application/pdf' || file.mimetype === 'application/octet-stream')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resumes are supported. Please upload a .pdf file.'));
    }
  },
});

/**
 * POST /api/resume/analyze
 * multipart/form-data: resume (file, PDF), jobDescription (text)
 * Proxies to the AI Resume Match Analyzer FastAPI service.
 */
router.post('/analyze', (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message || 'Invalid resume upload.' });
      return;
    }
    try {
      const file = req.file;
      const jobDescription = (req.body.jobDescription || '').trim();

      if (!file) {
        res.status(400).json({ error: 'Please upload your resume as a PDF file.' });
        return;
      }
      if (file.size === 0) {
        res.status(400).json({ error: 'The uploaded file is empty.' });
        return;
      }
      if (!jobDescription) {
        res.status(400).json({ error: 'Please paste the job description or target role details.' });
        return;
      }
      if (jobDescription.length < 40) {
        res.status(400).json({
          error: 'The job description is too short for a meaningful analysis. Please paste a fuller description (at least a few sentences).',
        });
        return;
      }

      analyzeResume({ file, jobDescription })
        .then((result) => res.json(result))
        .catch((e) => {
          res.status(e.status || 500).json({ error: e.message || 'Resume analysis failed.' });
        });
    } catch (e) {
      res.status(500).json({ error: e.message || 'Resume analysis failed.' });
    }
  });
});

/* GET /api/resume/health — analyzer connectivity for the UI (keep last) */
router.get('/health', async (req, res) => {
  const { checkResumeAnalyzer } = require('../services/integration');
  const connected = await checkResumeAnalyzer();
  res.json({ connected });
});

module.exports = router;
