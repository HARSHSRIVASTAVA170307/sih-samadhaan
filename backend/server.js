require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { PORT, FRONTEND_ORIGIN, NODE_ENV } = require('./config');
const schemesRouter = require('./routes/schemes');
const resumeRouter = require('./routes/resume');
const roadmapRouter = require('./routes/roadmap');
const {
  resumeAnalyzerHealthy,
  roadmapEngineHealthy,
} = require('./services/integration');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
if (NODE_ENV !== 'test') app.use(morgan('dev'));

/* ------------------------------------------------------------------ */
/* Health & meta                                                       */
/* ------------------------------------------------------------------ */
app.get('/api/health', async (req, res) => {
  const [resumeAnalyzer, roadmapEngine] = await Promise.all([
    resumeAnalyzerHealthy(),
    Promise.resolve(roadmapEngineHealthy()),
  ]);

  res.json({
    status: 'ok',
    service: 'portal-for-academia-backend',
    time: new Date().toISOString(),
    services: {
      backend: true,
      resumeAnalyzer, // true when AI Resume Match Analyzer reports healthy
      roadmapEngine, // true when GROQ_API_KEY is configured
    },
  });
});

/* ------------------------------------------------------------------ */
/* Feature routes                                                      */
/* ------------------------------------------------------------------ */
app.use('/api/schemes', schemesRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/roadmap', roadmapRouter);

/* 404 for unknown API routes */
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

/* Central error handler */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, async () => {
  const analyzerUp = await resumeAnalyzerHealthy();
  console.log(`\n  Portal for Academia — backend`);
  console.log(`  → http://localhost:${PORT}  (env: ${NODE_ENV})`);
  console.log(
    `  → resume-analyzer: ${analyzerUp ? 'connected' : 'not reachable (start it on :8001)'}`
  );
  console.log(
    `  → roadmap engine:  ${roadmapEngineHealthy() ? 'ready' : 'GROQ_API_KEY missing'}\n`
  );
});

module.exports = app;
