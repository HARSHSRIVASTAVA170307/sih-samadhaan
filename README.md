# SkillSetu — Portal for Academia–Industry Collaboration

**Smart India Hackathon prototype** for *"Portal for Academia – Industry Collaboration for Skill Mapping, Internships and Placement."*

SkillSetu is a career platform for students with **three fully working features**:

| Feature | Powered by | How it is integrated |
|---|---|---|
| 🧠 **AI Resume Analyzer** | [AI-Resume-Match-Analyzer](https://github.com/aadi090204/AI-Resume-Match-Analyzer) (FastAPI + Gemini) | HTTP proxy: `Node /api/resume/analyze` → `FastAPI /analyze`. The Node layer parses the analyzer's structured text report into JSON for the UI. |
| 🗺️ **Personalized Career Roadmap** | [SkillRoute](https://github.com/balasaravanank/SkillRoute) (FastAPI + Groq) | Imported **directly as a Python library** — the backend calls SkillRoute's own `roadmap_agent.generate_roadmap()` through a tiny bridge (`backend/services/roadmap_bridge.py`). Only its Firebase-auth routes are bypassed. |
| 🏛️ **Government Schemes Dashboard** | Curated JSON dataset | Served by Express from `backend/data/schemes.json` via `/api/schemes` with search, category filters and pagination. |

No placeholder buttons — every feature works end-to-end.

---

## 1. Requirements

| Tool | Version | Used for |
|---|---|---|
| Node.js | 18+ (20+ recommended) | Frontend + main backend |
| Python | 3.10+ | Resume analyzer + roadmap engine |
| npm | 9+ | Package management |
| Gemini API key | free tier works | Resume analysis |
| Groq API key | free tier works | Roadmap generation |

---

## 2. Installation (one command)

From the project root:

```bash
npm run setup
```

This installs root, `backend/` and `frontend/` node dependencies. The Python
services have their own virtual environments (next step).

---

## 3. Python setup (resume analyzer + roadmap engine)

Both Python services share one virtual environment in this workspace for
simplicity:

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

pip install fastapi "uvicorn[standard]" pypdf python-dotenv
pip install google-generativeai      # resume analyzer needs this
pip install groq                     # roadmap engine needs this
```

### Keys

Create the two env files (no Firebase or OAuth setup is needed):

- `resume-analyzer/backend/.env`
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
  (copy from `resume-analyzer/backend/.env.example`)

- `backend/.env`
  ```env
  PORT=4000
  FRONTEND_ORIGIN=http://localhost:5173
  RESUME_ANALYZER_URL=http://127.0.0.1:8001
  GROQ_API_KEY=your_groq_api_key_here
  ```
  (copy from `backend/.env.example`)

Get a **Gemini** key at https://aistudio.google.com/apikey and a **Groq** key at
https://console.groq.com/keys — both have free tiers.

---

## 4. Running everything (3 terminals)

```bash
# Terminal 1 — Resume analyzer (FastAPI on :8001)
cd resume-analyzer/backend
python run_server.py   # launcher that patches the retired Gemini model (do NOT use plain uvicorn)

# Terminal 2 — Main backend (Express on :4000)
cd backend
npm run dev

# Terminal 3 — Frontend (Vite on :5173)
cd frontend
npm run dev
```

Or start backend + frontend together from the root:

```bash
npm run dev
```

Then open **http://localhost:5173**

> The app is fully usable even if you skip Terminal 1 — the dashboard shows a
> live status badge and the resume page explains exactly what to start.
> Without `GROQ_API_KEY`, roadmap generation is disabled with a clear message.

---

## 5. How the repositories are integrated

```
frontend (React 18 + Vite, :5173)
    │  /api/*  (Vite proxy)
    ▼
backend (Node/Express, :4000)
    ├── /api/schemes/*          → reads backend/data/schemes.json
    ├── /api/resume/analyze     ──HTTP──▶ resume-analyzer/backend (FastAPI :8001) ──▶ Gemini
    └── /api/roadmap/generate   ──bridge─▶ roadmap/backend SkillRoute agent ──▶ Groq
```

### AI Resume Analyzer (`resume-analyzer/`)

- The repo is cloned as-is at `resume-analyzer/` (its `frontend/` is unused).
- `resume-analyzer/backend/run_server.py` (our launcher, repo files untouched)
  overrides the hardcoded model `gemini-2.5-flash-lite` — which Google has
  blocked for new API keys — with a current one (`gemini-3.5-flash-lite`,
  configurable via `GEMINI_MODEL` in `resume-analyzer/backend/.env`).
- `backend/services/integration.js` forwards the uploaded PDF + job description
  as multipart form-data to `POST /analyze`, then parses the numbered text
  report (score, strong matches, gaps, ATS keywords, suggestions, improved
  bullets, recommendation) into structured JSON.
- The service is health-checked (`GET /health`) for the dashboard status badge.

### Career Roadmap (`roadmap/` — SkillRoute)

- Cloned as-is at `roadmap/`.
- SkillRoute's routes require Firebase auth + Firestore. Rather than forking the
  agent logic, `backend/services/roadmap_bridge.py` adds the repo to `sys.path`
  and imports `app.services.roadmap_agent.generate_roadmap` directly, running it
  via `asyncio`. The agent's prompt, retry logic and resource fallbacks are used
  unchanged.
- SkillRoute's rule-based clarity scoring (`matching_service`) is mirrored in JS
  (`backend/services/integration.js`) for a fast UI call with identical weights.

### Government Schemes

- Data lives in `backend/data/schemes.json` (24 schemes: PM Internship Scheme,
  NSP, PM-YASASVI, PM Vishwakarma, PMKVY, DDU-GKY, NATS, AICTE scholarships,
  Startup India, SWAYAM, PMRF, MUDRA and more).
- Every scheme links to its **official government portal**; nothing is
  fabricated — deadlines that vary are marked "Check official portal".
- To move to a real database later, only `backend/services/schemesService.js`
  needs to change.

---

## 6. API reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend + integration status |
| GET | `/api/schemes` | List schemes (`?q=&category=&page=&pageSize=&sort=`) |
| GET | `/api/schemes/categories` | Filter categories |
| GET | `/api/schemes/stats` | Counts by category/ministry |
| GET | `/api/schemes/:id` | Single scheme |
| GET | `/api/resume/jobs` | Preloaded company job descriptions (`?q=` search) |
| GET | `/api/resume/jobs/:id` | Single target-company JD |
| POST | `/api/resume/analyze` | multipart: `resume` (PDF) + `jobDescription` |
| GET | `/api/resume/health` | Analyzer connectivity |
| POST | `/api/roadmap/clarity` | Rule-based clarity score |
| POST | `/api/roadmap/generate` | Profile → career decision + roadmap |

FastAPI docs (when running): http://127.0.0.1:8001/docs

---

## 7. Project structure

```
project/
├── frontend/                  # React 18 + Vite (pages, components, services)
│   └── src/
│       ├── pages/             # Landing, Dashboard, Resume, Roadmap, Schemes, Saved, About
│       ├── components/        # icons.jsx
│       └── services/          # api.js, localStore.js
├── backend/                   # Node/Express main API (:4000)
│   ├── routes/                # schemes.js, resume.js, roadmap.js
│   ├── services/              # schemesService, jobsService, integration, roadmapBridge(.js/.py)
│   ├── data/schemes.json      # Government schemes dataset
│   ├── data/jobDescriptions.json  # Preloaded target-company JDs (12 companies)
│   └── server.js
├── resume-analyzer/           # AI-Resume-Match-Analyzer repo (cloned as-is)
└── roadmap/                   # SkillRoute repo (cloned as-is)
```

---

## 8. Feature scope & future extensions

**Included now:** AI Resume Analyzer, Personalized Career Roadmap, Government
Schemes Dashboard (search, filters, details, bookmarks), Student Dashboard,
responsive landing page.

**Deliberately excluded (future extensions):** chatbot, job portal, company
placement portal, complex authentication, payments, blockchain, interview
simulator, social features, AI interview prep, admin panel, notifications,
email. The service-based architecture is ready for them without a rebuild.

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| "resume analyzer service is not running" | Start Terminal 1 (FastAPI on :8001) |
| "GEMINI API key missing" | Add `GEMINI_API_KEY` to `resume-analyzer/backend/.env` |
| Gemini error "no longer available to new users" | Start the analyzer with `python run_server.py` (it patches the model); or set `GEMINI_MODEL=gemini-2.5-flash` in its `.env` |
| Roadmap error "GROQ_API_KEY is not configured" | Add `GROQ_API_KEY` to `backend/.env`, restart backend |
| "Python is not available" | Install Python 3.10+ and ensure `python` is on PATH |
| "No readable text found in the uploaded resume" | The PDF is scanned/image-based; upload a text-based PDF |
| CORS errors | Keep frontend on :5173 (Vite proxies `/api` to :4000) |
