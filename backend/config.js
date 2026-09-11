require('dotenv').config();

const parsedPort = parseInt(process.env.PORT, 10);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

/* URL of the AI Resume Match Analyzer FastAPI service */
const RESUME_ANALYZER_URL =
  process.env.RESUME_ANALYZER_URL || 'http://127.0.0.1:8001';

module.exports = { PORT, NODE_ENV, FRONTEND_ORIGIN, RESUME_ANALYZER_URL };
