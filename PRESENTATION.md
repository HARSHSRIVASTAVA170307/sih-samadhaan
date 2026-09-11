# SkillSetu — SIH Presentation Deck

> **Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement**
> 30 slides · full speaker notes · ready to paste into PowerPoint / Google Slides
> Every technical claim in this document reflects the actual built system.

---

## SLIDE 1 — Title

**ON SLIDE:**

# SkillSetu
### Portal for Academia–Industry Collaboration
**Skill Mapping · Career Roadmaps · Government Schemes**

Smart India Hackathon 2026 — Working Prototype

Team [Your Team Name] · [College Name]

**SPEAKER NOTES:**

Good morning everyone. We are presenting SkillSetu — a career platform for Indian students that connects three things which today exist in three disconnected worlds: what industry actually expects from candidates, what skills a student personally has, and what the Government of India already offers to help them grow.

The name tells you our intent: "Setu" means bridge in Sanskrit and Hindi. SkillSetu is a bridge — between academia and industry, between a student's current abilities and their dream career, and between government welfare schemes and the students who never hear about them.

Three things to know before we start: First, everything you will see today is real and working — no mockups, no "coming soon" buttons. Second, we did not build everything from scratch; we intelligently integrated two proven open-source AI projects and wrapped them into one coherent product, which we will explain in depth. Third, the entire platform runs on free-tier AI APIs, which means zero running cost — an important fact for any government-scale adoption story.

In the next fifteen minutes we will walk through the problem, the architecture, and a live demonstration of all three core features, and then explain exactly how every piece works under the hood.

---

## SLIDE 2 — Agenda

**ON SLIDE:**

1. The Problem — three disconnected systems
2. Our Solution — one platform, three engines
3. System Architecture — the full picture
4. Feature Deep-Dive 1: AI Resume Analyzer
5. Feature Deep-Dive 2: Personalized Career Roadmap
6. Feature Deep-Dive 3: Government Schemes Dashboard
7. Bonus: Target Company Job Descriptions
8. How We Integrated Open Source (the honest engineering story)
9. Error Handling, Security & Privacy
10. Testing Evidence, Impact & Future Scope

**SPEAKER NOTES:**

Here is our roadmap for this presentation. We will start with the problem statement and why existing solutions fail students. Then we show the solution at a bird's-eye view before descending into each of the three core features. For each feature, we will show both what the user sees AND how it works internally — because judges should evaluate engineering, not just screenshots.

A special section is dedicated to how we integrated two existing GitHub repositories rather than reinventing them — this is a deliberate engineering decision that we believe mirrors how real industry teams work: reuse proven components, integrate them cleanly, and add value in the glue layer.

We will also cover the parts that teams usually skip in presentations but which determine whether a product is real: error handling, what happens when APIs fail, privacy of student resumes, and the actual test evidence we gathered while building.

Finally, we close with impact numbers, future scope, and a live demo. Please feel free to interrupt with questions at any point — we know every line of this system.

---

## SLIDE 3 — The Problem

**ON SLIDE:**

**Three systems that should work together — but don't:**

| Reality today | Consequence for students |
|---|---|
| 📄 Resumes are rejected by ATS filters | Good students never reach interviews |
| 🧭 Career guidance is generic and static | Students prepare for the wrong roles |
| 🏛️ Government schemes are scattered across 40+ portals | Free money and training goes unclaimed |

- India has **millions** of students entering the job market yearly
- Employers complain of a **skills gap**; students complain of **no guidance**
- No single platform connects *self-assessment → skill plan → funding*

**SPEAKER NOTES:**

Let's start with the problem we are solving. Indian students face three separate failures in the current ecosystem, and — critically — no existing product connects them.

Failure one: the resume wall. Large companies receive lakhs of applications. The first filter is not a human — it is an Applicant Tracking System that scans resumes for relevant keywords and structure. A capable student with a poorly formatted or poorly worded resume gets rejected before any human sees their potential. Nobody gives that student feedback — they just hear silence.

Failure two: generic guidance. Ask a student "what career should I pursue?" and they get either vague advice ("do what you love") or static roadmap images from the internet that don't know anything about the student's current skills, available time, or learning pace. The result is students preparing for roles that don't fit them, or worse, freezing with decision paralysis.

Failure three: unclaimed government support. The Government of India runs dozens of generous programs — the PM Internship Scheme pays a stipend for twelve months, AICTE gives girl students fifty thousand rupees per year, SWAYAM offers free courses from IIT professors. But this information is scattered across the websites of sixteen-plus ministries, each with different terminology. The students who most need these schemes are the least likely to find them.

The gap is the connection. A student who learns "I'm missing TypeScript" should immediately see "here's a 5-month plan to learn it" and "here's a free government course that covers it." That connected loop is exactly what we built.

---

## SLIDE 4 — Our Solution: SkillSetu

**ON SLIDE:**

**One platform, three working engines:**

| Feature | What it does | Powered by |
|---|---|---|
| 🧠 AI Resume Analyzer | Match score, skill gaps, ATS keywords, improved bullets | AI-Resume-Match-Analyzer (Gemini) |
| 🗺️ Career Roadmap | AI picks your best-fit career + phased learning plan | SkillRoute (Groq LLM agent) |
| 🏛️ Gov Schemes Dashboard | 25 schemes, search, filters, official links | Curated JSON + Express API |
| 🎯 Target Companies | 12 preloaded company JDs to analyze against | JSON + Express API |

- Zero sign-up · Zero cost · Works on mobile and desktop

**SPEAKER NOTES:**

SkillSetu's answer is a single platform with three deeply integrated engines.

The AI Resume Analyzer takes a student's resume PDF and any job description — one they paste, or one of the twelve preloaded descriptions from companies like Amazon, Google, TCS and Cognizant — and returns a genuine AI analysis: a match score out of 100, the exact strengths that matched, the honest gaps, ATS keywords they should add, and rewritten resume bullets that improve presentation without fabricating experience.

The Personalized Career Roadmap goes a step deeper. The student describes their profile — skills, interests, education, how many hours per week they can study. An AI agent then makes an actual career decision with reasoning and confidence scores, and produces a phased learning roadmap — typically five phases over twelve months — where every single milestone comes with real, free learning resources: YouTube courses, freeCodeCamp tracks, official documentation.

The Government Schemes Dashboard makes welfare discoverable: twenty-five central government schemes for students, searchable by keyword and filterable by category — scholarships, internships, skill development, employment, entrepreneurship — each with eligibility, benefits, deadlines, and a direct link to the official application portal.

And a bonus feature judges love: twelve preloaded target-company job descriptions, so a student can check themselves against Amazon's actual SDE expectations in one click.

All of this with zero sign-up friction and zero cost — a deliberate design decision for a government-facing prototype, which we will justify later.

---

## SLIDE 5 — Design Philosophy

**ON SLIDE:**

- **Integrate, don't reinvent** — two proven open-source AI engines inside one product
- **JSON-first data** — no database until we truly need one; swap-in ready
- **Fail loudly but kindly** — every error tells the user exactly what to do
- **Privacy by architecture** — resumes processed in memory, never stored
- **Presentation-grade UI** — custom design system, not a template

**SPEAKER NOTES:**

Before diving into architecture, four engineering principles shaped every decision we made — and we want to be explicit about them because they explain the codebase.

First: integrate, don't reinvent. Two excellent open-source projects already existed — AI-Resume-Match-Analyzer for resume-versus-job-description analysis and SkillRoute for AI career roadmapping. Instead of copying their logic or rebuilding weaker versions, we run their actual code inside our platform behind a single clean API. This gave us battle-tested AI prompts, retry logic, and guardrails on day one, and it demonstrates a real-world engineering skill: system integration.

Second: JSON-first data. We deliberately avoided MongoDB or Firebase in the prototype. The schemes data lives in a plain JSON file served by Express. Why? For a hackathon prototype, a database adds setup friction without adding value — but our service layer is designed so that swapping JSON for SQLite or Mongo later touches exactly one file.

Third: fail loudly but kindly. Most hackathon demos die when something errors and the UI shows a blank screen or a cryptic message. Every failure path in SkillSetu — missing API key, stopped service, scanned PDF, slow network — produces a specific, human-readable message telling the user exactly what to do. You'll see examples.

Fourth: privacy by architecture. Resumes pass through memory as bytes and are never written to disk or a database. Saved schemes live in the student's own browser. There is no account, so there is nothing to leak.

---

## SLIDE 6 — System Architecture (Full Picture)

**ON SLIDE:**

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND — React 18 + Vite  (localhost:5173)       │
│  7 pages · custom design system · localStorage      │
└──────────────────────┬──────────────────────────────┘
                       │ /api/* (Vite dev proxy)
┌──────────────────────▼──────────────────────────────┐
│  MAIN BACKEND — Node.js + Express  (localhost:4000) │
│  schemes │ resume │ roadmap │ health routes         │
│  schemes.json · jobDescriptions.json                │
└───────┬─────────────────────────────┬───────────────┘
        │ HTTP proxy                  │ Python bridge
┌───────▼──────────────┐   ┌──────────▼───────────────┐
│ RESUME ANALYZER      │   │ SKILLROUTE AGENT         │
│ FastAPI  (port 8001) │   │ (library import, no      │
│ pypdf + Gemini API   │   │  Firebase) + Groq API    │
└──────────────────────┘   └──────────────────────────┘
```

**SPEAKER NOTES:**

This is the complete system architecture, and every box here is a running process.

At the top is the frontend — a React 18 single-page application built with Vite. It contains seven pages: landing, dashboard, resume analyzer, career roadmap, government schemes, saved schemes, and an about page. It talks exclusively to one address: the main backend's /api namespace. During development, Vite's built-in proxy forwards those requests, which elegantly eliminates CORS issues in local development.

In the middle is the main backend — a Node.js and Express server on port 4000. This is the brain and gatekeeper of the system. It serves the schemes and job-description datasets from JSON files, exposes clean REST endpoints for every feature, validates all input before anything expensive happens, and orchestrates the two AI services.

At the bottom sit the two AI engines, and notice they connect in two deliberately different ways.

The resume analyzer connects over HTTP — it is a separate FastAPI process on port 8000-8001 that receives multipart file uploads, extracts PDF text with pypdf, and calls Google's Gemini API.

The roadmap engine connects differently — and this is a key design decision. SkillRoute's agent code is imported directly as a Python library through a small bridge process. We do not run SkillRoute's web server at all, which means we bypass its Firebase authentication dependency entirely while using its actual AI agent, its prompt engineering, and its retry logic unchanged.

Why two different integration styles? Because the resume analyzer is naturally a file-upload service — HTTP is its native interface. The roadmap engine is naturally a function call — so we call it like a function. Choosing the right integration for each dependency is the difference between a fragile glue and a clean one.

---

## SLIDE 7 — Project Structure

**ON SLIDE:**

```
project/
├── frontend/          React SPA (pages, components, services)
├── backend/           Express API
│   ├── routes/        schemes.js · resume.js · roadmap.js
│   ├── services/      schemesService · jobsService
│   │                  integration · roadmapBridge.js + .py
│   └── data/          schemes.json (25) · jobDescriptions.json (12)
├── resume-analyzer/   AI-Resume-Match-Analyzer (cloned, intact)
└── roadmap/           SkillRoute (cloned, intact)
```

- Both reference repos sit **unmodified** inside the monorepo
- Our code lives only in `frontend/` and `backend/`
- `git diff` against either repo = **zero changes**

**SPEAKER NOTES:**

Here is how the codebase is physically organized, and the layout itself tells our integration story.

The two cloned repositories — AI-Resume-Match-Analyzer and SkillRoute — sit inside the project exactly as their authors published them. We have not edited a single line in either one. If you run git diff against their upstream remotes, you get zero changes. We add two small launcher files *next to* their code — more on that in the model-compatibility section — but their source remains pristine.

All of our original code lives in two folders. The frontend folder follows the structure the requirements specified: pages for each feature, shared components including a hand-built icon library, and a services layer that funnels every network call through one module.

The backend folder follows the classic separation: routes files define the HTTP surface of each feature, services files contain the actual logic — data loading, search, the analyzer report parser, the Python bridge — and the data folder holds the two JSON datasets.

Why does this matter? Three reasons. First, maintainability: any teammate can find any feature in seconds. Second, upgradeability: if the upstream repos publish improvements, we can pull them without merge conflicts, because we never touched their code. Third, modularity for the future: when internships and placement tracking get added as SIH requires, they become a new routes file plus a new service file — the existing structure doesn't bend.

---

## SLIDE 8 — Technology Stack & Why

**ON SLIDE:**

| Layer | Choice | Why this and not that |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR; requirement-aligned; no heavy UI kit needed |
| Routing | React Router 6 | SPA navigation with clean URLs |
| Styling | Hand-written CSS design system | Full control, no template look, 26 KB total |
| Main API | Node.js + Express | Required stack; huge ecosystem |
| Resume engine | Python FastAPI + pypdf + Gemini | The repo's proven stack, kept as-is |
| Roadmap engine | Python + Groq (LLM) | SkillRoute's agent, imported as library |
| Data | JSON files | Zero setup; swappable for DB later |
| Storage (user) | browser localStorage | No accounts → no data to protect |

**SPEAKER NOTES:**

Let us justify the stack choice by choice, because judges should always ask "why this technology?"

React 18 with Vite: React was mandated by the SIH requirements and is also simply the right tool — component reuse across seven pages (cards, modals, badges, buttons appear everywhere) keeps the codebase small. Vite over Create-React-App because it starts in milliseconds and builds in under two seconds — you saw that live. Notably, we did NOT pull in Tailwind or any component library. The entire look is one hand-written stylesheet of about twenty-six kilobytes. That gives SkillSetu a custom identity instead of the generic Tailwind-template look that half of all hackathon projects share.

Express for the main API: mandated, and sufficient. It handles static JSON serving, multipart upload validation via multer, request proxying, and error handling with a few dozen lines per route.

Python stays exactly where the repositories put it: FastAPI serving the resume analyzer, and the Groq SDK powering SkillRoute's agent. We run Python 3.14 in this environment — proof the code is not pinned to old runtimes.

JSON instead of a database deserves the honest explanation: our datasets are twenty-five schemes and twelve job descriptions totaling under thirty kilobytes. A database would add install steps, connection management, and failure modes for zero benefit at this scale. The service layer is the only code that touches the data files, so introducing SQLite later is a one-file change — the API contract never moves.

localStorage for user state: saved schemes, recent activity, and the student's name persist in their own browser. For an accountless prototype this is not a shortcut — it is the privacy-correct choice, and it survives page reloads.

---

## SLIDE 9 — FEATURE 1: AI Resume Analyzer (User View)

**ON SLIDE:**

**The student experience:**

1. Drag & drop resume PDF (or click to browse) — type & size validated instantly
2. Paste a job description **or** click *Browse companies* → pick from 12 preloaded JDs
3. Hit **Analyze Resume** → live progress stepper (5 stages)
4. Results dashboard in ~10–40 seconds:
   - Match score dial (color-coded) + recommendation badge
   - ✅ Strong matches · ⚠️ Skill gaps · 🔑 ATS keywords
   - 🛠️ Improvement suggestions · ✍️ rewritten resume bullets
   - Full raw AI report, expandable

**SPEAKER NOTES:**

Now into the first feature deep-dive, starting from what the student actually sees.

The interface is a two-column layout. On the left, three input cards guide a natural flow: upload, target, submit. The upload zone accepts drag-and-drop — the way students actually interact — and validates immediately: PDFs only, maximum ten megabytes. Pick a JPG or an eighteen-megabyte file and you are told instantly, before any upload happens.

The second card is the job description. The student can paste any posting they find on LinkedIn or a company site — but the faster path is our Browse companies picker: a searchable modal of twelve preloaded job descriptions from Amazon, Google, Meta, Microsoft, TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Zoho and Oracle. One click fills the textarea and shows a target pill identifying the company, with a link to that company's official careers page.

Then the analyze button — disabled until a valid file exists, so you cannot trigger an empty request. While the AI works, the right column shows a progress stepper walking through five named stages: uploading, extracting text, comparing against the job description, scoring, and preparing suggestions. This is honest theater in the sense that the AI call is a single operation — but it gives the student confidence something is happening, and each stage genuinely corresponds to what the backend does.

The results dashboard is the payoff: a color-coded score dial — green above seventy, amber in the middle, red below — a recommendation badge like "Apply after edits," and four structured lists: strong matches, skill gaps, ATS keywords, improvement suggestions, plus rewritten resume bullets. For full transparency there is a toggle to view the complete raw AI report exactly as Gemini produced it.

---

## SLIDE 10 — FEATURE 1: What Happens Under the Hood

**ON SLIDE:**

```
PDF bytes ──▶ Express validation ──▶ FastAPI /analyze
                                        │ pypdf extracts text
                                        ▼
                              Gemini prompt (7 guardrails)
                                        │
                                        ▼
                          Structured text report (7 sections)
                                        │
Express parses report ──◀───────────────┘
into: score · 6 section lists · recommendation
```

- Score regex handles `72/100`, `72 out of 100`, `72%`, or bare `72`
- Recommendation classified: `apply-now` / `apply-after-edits` / `build-more-evidence`
- Analyzer's own config errors detected and surfaced as clear 503s

**SPEAKER NOTES:**

Here is the same journey in engineering terms, because this is where the interesting work lives.

Step one: the browser sends the PDF as multipart form data to Express at /api/resume/analyze. Express validates before anything else: file present, non-empty, PDF extension and MIME type, size under ten megabytes, job description at least forty characters — because the upstream analyzer itself warns that tiny job descriptions produce useless analyses. Bad requests die here with a specific message, never reaching the AI and never costing an API call.

Step two: Express forwards the file to the FastAPI service — a real health check happens first, so if the Python service is down, the student immediately learns "start the analyzer service with this exact command" instead of a mysterious timeout.

Step three: inside the analyzer — and this is the repository's code running untouched — pypdf extracts readable text page by page. If the PDF is a scanned image with no text layer, the pipeline stops with a clear message, because Gemini cannot analyze pixels of a scanned resume.

Step four: the extracted text and job description are embedded into a carefully engineered prompt with seven explicit guardrails from the upstream project: be practical, don't invent experience, identify gaps honestly, don't fabricate metrics like "X% improvement," and so on. This prompt discipline is why the output is recruiter-grade instead of chatbot-soup.

Step five — our glue layer: Gemini returns a structured numbered text report. Our parser in Express splits it into the seven known sections using anchored regexes, converts each section's lines into clean array items, extracts the numeric score handling every format Gemini might use — "72/100", "72 out of 100", "72 percent" — and classifies the final recommendation into one of three machine-readable categories that drive the UI badge.

Step six: error translation. If Gemini's reply indicates a missing key or a retired model, the parser recognizes those signatures and converts them into precise, actionable errors rather than showing the student a broken "score: null" screen.

---

## SLIDE 11 — FEATURE 1: Live Evidence

**ON SLIDE:**

**Actual test runs from our build environment:**

| Test | Result |
|---|---|
| Fresher resume vs Frontend Developer JD | **Score 75/100** — "apply after edits", 4 matches, 3 gaps, 5 ATS keywords, 4 rewritten bullets |
| Same resume in browser UI | Score 70/100, all sections rendered, zero console errors |
| Fresher resume vs **Amazon SDE JD** (preloaded) | **Score 55/100** — "build more evidence", flagged missing DSA/OS/DBMS theory |
| Scanned/empty PDF | Clean rejection: "No readable text found" |
| Missing Gemini key | Clear 503: "add GEMINI_API_KEY to .env and restart" |

**SPEAKER NOTES:**

We do not ask you to trust screenshots — here are the actual recorded results from our verification runs, and they demonstrate something more important than high scores: the system is honest.

In the first test, a junior frontend resume against a junior frontend job description scored seventy-five out of one hundred with the recommendation "apply after small edits." The AI identified four genuine strong matches — JavaScript, React, HTML, CSS, Git — three honest gaps including REST API integration not being explicitly mentioned, five ATS keywords, and four rewritten bullets. Crucially, the rewritten bullets improve presentation without inventing numbers — a direct consequence of the upstream project's anti-exaggeration guardrails, which we preserved deliberately.

The second test ran the identical analysis through the browser UI end-to-end: score seventy, every section rendered, zero JavaScript console errors. Slight score variation between runs is expected — LLMs are probabilistic — and the UI is designed around ranges, not false precision.

The third test is our favorite for judges: the same fresher resume against our preloaded Amazon SDE description scored fifty-five with the recommendation "build more evidence first," specifically flagging the absence of data structures and algorithms depth, operating systems, and DBMS theory. That is exactly the honest, role-specific guidance a second-year student needs — and it proves the twelve-company dataset produces differentiated, meaningful analyses, not interchangeable flattery.

The final two rows show failure-path behavior: scanned PDFs and missing keys produce precise, instructive errors. The system never fakes an analysis.

---

## SLIDE 12 — FEATURE 2: Career Roadmap (User View)

**ON SLIDE:**

**The student experience:**

1. Profile form: name, education, **current skills**, interests, **target career**, hours/week, pace
2. Career suggestion chips: Full Stack, Data Scientist, AI/ML, DevOps, Cybersecurity, UI/UX…
3. Optional **clarity check** → instant rule-based score (0–100)
4. **Generate My Roadmap** → AI agent decides + plans (~15–60 s)
5. Results: career decision card with 4 metrics, strengths vs gaps, 5-phase timeline, 39+ real resources, alternatives considered, progress tracking

**SPEAKER NOTES:**

The second feature answers the question every student carries: "given who I am, what career fits, and how do I get there?"

The form collects exactly what the AI agent needs — and nothing more. Education level from a dropdown, current skills as a comma-separated line, interests, an optional target career, how many hours per week the student can realistically study, and their preferred pace. Career suggestion chips let a student who has no target start from common paths with one click. Every field validates client-side and again server-side.

The clarity check is a small but thoughtful piece borrowed from SkillRoute's logic layer: three quick questions — do you have a career in mind, how familiar are you with tech career paths, what is your primary goal — produce an instant rule-based score from zero to one hundred. A student scoring "exploring" tells the agent to evaluate many careers broadly; a "focused" student tells it to optimize one path deeply. We verified the scoring math: the exact same answers produce the exact same score as SkillRoute's original Python implementation — our JavaScript port uses identical weights.

Then comes the moment of the demo: Generate My Roadmap. The AI agent analyzes the profile, evaluates multiple candidate careers, and returns its decision with explicit reasoning, a confidence percentage, a skill-match percentage, a market-readiness percentage, and a realistic time-to-job-ready estimate.

The visualization is a vertical timeline: typically five phases across twelve months, each with difficulty badges, focus skills, expected outcomes, and two to three milestones — and every milestone carries real learning resources: specific YouTube courses, freeCodeCamp tracks, official documentation, with durations. Below the timeline, the agent shows which alternative careers it considered and why it rejected them — transparency that builds trust in the recommendation.

---

## SLIDE 13 — FEATURE 2: What Happens Under the Hood

**ON SLIDE:**

```
Profile JSON ──▶ Express validation (mirrors SkillRoute's rules)
                    │
                    ▼
        roadmap_bridge.py (spawned subprocess)
        ├─ sys.path.insert(roadmap/backend)
        ├─ Groq SDK model-compatibility patch
        └─ imports app.services.roadmap_agent.generate_roadmap
                    │
                    ▼
        SkillRoute AgentX system prompt (their code, unchanged)
        ├─ llama-3.3-70b → remapped to available model
        ├─ JSON-only output rule, real-URL rule
        └─ 3 retries with exponential backoff (their logic)
                    │
                    ▼
        _ensure_resources(): every milestone gets real URLs
```

**SPEAKER NOTES:**

This slide is the heart of our integration story — how we run SkillRoute's agent without running SkillRoute's server.

When the generate request arrives, Express validates it against the same rules SkillRoute's own routes enforce: name, education, skills, interests and goals required; weekly hours between one and forty; pace restricted to slow, medium or fast. The profiles are structurally identical — because it is the same Pydantic model underneath.

Express then spawns a Python subprocess running our bridge script. The bridge does three things in order.

First, it inserts SkillRoute's backend directory into the Python path and imports their agent module directly — `app.services.roadmap_agent.generate_roadmap`. No HTTP call, no server, no Firebase. Their agent is, architecturally, just an async Python function; we call it like one.

Second, it applies a compatibility patch at the SDK layer — which we will show on the next slide, because it is a genuinely interesting war story.

Third, it runs the agent through asyncio and streams back the result as JSON. All of SkillRoute's internal quality machinery remains active: their system prompt — branded AgentX — enforces JSON-only output, forbids placeholder URLs, restricts resources to trustworthy domains like YouTube, freeCodeCamp, MDN, Coursera and Kaggle; their retry logic wraps the LLM call in three attempts with exponential backoff; and their post-processor, _ensure_resources, validates every resource URL in the generated roadmap and injects curated fallback resources for any milestone whose links came back empty or malformed. The result we demonstrated contained thirty-nine working links with zero insecure or placeholder URLs — that is their guardrail stack doing its job, inside our product.

The bridge process exits after each call — no resident Python process to manage, no state to leak between students.

---

## SLIDE 14 — The Model Compatibility War Story

**ON SLIDE:**

**Problem:** Both repos hardcode LLM model IDs that their providers have since **retired** for new API keys:
- SkillRoute → `llama-3.3-70b-versatile` (Groq: 404 model_not_found)
- Analyzer → `gemini-2.5-flash-lite` (Google: "no longer available to new users")

**Our fix — zero repo edits:**
- Groq: monkey-patch `AsyncCompletions.create` in the bridge → remap retired IDs to `openai/gpt-oss-120b` (override via `GROQ_MODEL` env)
- Gemini: `run_server.py` launcher overrides `app.config.GEMINI_MODEL_NAME` before app import → `gemini-3.5-flash-lite` (override via `GEMINI_MODEL` env)

**Lesson:** integrate at the layer that doesn't break the upgrade path.

**SPEAKER NOTES:**

This slide is our favorite engineering story, and we tell it because it demonstrates real-world debugging — the kind SIH judges rarely see presented.

When we first wired the keys in, both engines failed immediately with errors the repos' authors never anticipated: Groq returned "model does not exist or you do not have access," and Gemini returned "this model is no longer available to new users." The cause: the AI model landscape moves fast. Both repositories, published some months ago, hardcode model IDs that their providers have since retired for new accounts. Every new user of those repos hits the same wall today.

The naive fix is editing the repos — change the string, done. We rejected that, because it creates permanent divergence from upstream and turns every future improvement pull into a merge conflict.

Instead, we patched at the client layer. For Groq, our bridge monkey-patches the SDK's chat-completions method: if the requested model starts with a known-retired prefix, it transparently substitutes a currently available model before the request ever hits the network. The override is configurable through one environment variable, and the code documents where to look up the current model list the day even that model retires.

For Gemini, since the model name is read from the repo's config module at import time, we ship a twelve-line launcher that overrides the config value before the app imports — so their code reads an up-to-date model name from an object they still own.

The deeper lesson we want to leave you with: when integrating open source, patch at the layer that keeps the upgrade path alive. Configuration and client layers bend; source code edits cement. This is also why our README documents both override variables — the next maintainer inherits a working system, not a mystery.

---

## SLIDE 15 — FEATURE 3: Government Schemes Dashboard (User View)

**ON SLIDE:**

**The student experience:**

- **25 central-government schemes** across 6 categories
- 🔍 Instant search across name, ministry, description, eligibility
- 🏷️ One-click category chips: Scholarship · Internship · Skill Development · Employment · Entrepreneurship · Students
- Card = name, category badge, ministry, description, eligibility, deadline
- **View Details** → modal with full info + "Visit Official Portal" button
- 🔖 **Save** any scheme → bookmarked in browser, shown on Dashboard
- Graceful empty states: "No schemes match 'xyz' — try 'scholarship' or 'internship'"

**SPEAKER NOTES:**

The third feature looks simpler than the AI engines but carries our strongest data-integrity stance.

The dashboard opens on twenty-five curated schemes from the Government of India, rendered as cards in a responsive grid. Each card shows the essentials at a glance: category badge, scheme name, the ministry behind it, a plain-language description, an eligibility summary, and deadline status.

Search is instant and server-backed: typing "apprentice" narrows the grid to exactly the two apprenticeship schemes; "internship" finds four; the word "scholarship" matches eight schemes because the search spans names, ministries, descriptions and eligibility text. Category chips filter in one click — Scholarships, Internships, Skill Development, Employment, Entrepreneurship, and a Students category for tools like DigiLocker and SWAYAM Prabha.

View Details opens a modal with the complete picture: full description, precise eligibility, itemized benefits, deadline guidance, an honesty notice reminding students to verify current criteria on the official portal, and the primary action — Visit Official Portal — which links only to genuine government domains: pminternship.mca.gov.in for the PM Internship Scheme, scholarships.gov.in for the National Scholarship Portal, nats.education.gov.in for NATS, pmvishwakarma.gov.in, pmrf.in, and so on.

The Save button bookmarks a scheme into the student's browser — no account needed — and bookmarked schemes appear both on a dedicated Saved page with removal controls and on the student dashboard as a progress widget. We demonstrated this live: saving the PM Internship Scheme immediately updated the dashboard count and the recent-activity feed.

And when a search matches nothing, students see a helpful empty state suggesting better keywords — never a silent blank grid.

---

## SLIDE 16 — FEATURE 3: Data Pipeline & Integrity

**ON SLIDE:**

```json
{
  "id": "pm-internship-scheme",
  "name": "PM Internship Scheme (PMIS)",
  "ministry": "Ministry of Corporate Affairs",
  "category": "Internship",
  "description": "12-month paid internships…",
  "eligibility": "Ages 21–24, graduates…",
  "benefits": "₹5,000/month stipend + ₹6,000 grant…",
  "deadline": "Check official portal for current window",
  "officialLink": "https://pminternship.mca.gov.in/login/"
}
```

- Served by Express: `GET /api/schemes?q=&category=&page=&sort=`
- **Zero fabricated facts** — variable deadlines say "check official portal"
- Coverage: PMIS · NSP · PM-YASASVI · Vishwakarma · PMKVY · DDU-GKY ·
  NATS · NAPS · AICTE Pragati/Saksham · PMSS · Startup India · Stand-Up India ·
  MUDRA · SWAYAM · SWAYAM Prabha · NEAT · PMRF · DigiLocker · PMGDISHA · more

**SPEAKER NOTES:**

Here is the data contract behind the dashboard, and the integrity rules we imposed on ourselves.

Every scheme is a JSON object with exactly the fields the SIH requirements specified: name, ministry, category, description, eligibility, benefits, deadline, and official link — plus a stable slug id that lets the frontend deep-link straight into a scheme's modal from the dashboard.

The API is a clean REST surface: the list endpoint accepts a search query, a category filter, pagination parameters and a sort order; a stats endpoint reports counts by category and ministry — currently eight scholarships, four internships, six skill-development programs, four entrepreneurship schemes, and so on across sixteen ministries — and the single-scheme endpoint powers detail views and deep links.

Now the integrity stance, because government data demands it. We verified portal URLs against current public information before writing them into the dataset. Where a number is stable and published — the PM Internship Scheme's monthly stipend structure, AICTE's fifty-thousand-rupee annual scholarship, MUDRA's loan tiers — we state it. Where details genuinely change cycle to cycle — application windows, cutoffs — the deadline field says "Check official portal" instead of a date we cannot guarantee. We chose twenty-five schemes for depth-with-accuracy over two hundred half-verifiable entries, and every one links to its canonical government domain.

Architecture-wise, the service layer is the only code that reads the JSON file, loading from disk on each request in development so the data can be edited live, and caching in production. The day this needs to become a real database — or a live sync from a government API like myScheme — the change is contained to that single service file, and every consumer of the API is untouched.

---

## SLIDE 17 — BONUS FEATURE: Target Company Job Descriptions

**ON SLIDE:**

- 12 preloaded JDs: **Amazon · Google · Meta · Microsoft · TCS · Infosys · Wipro · Accenture · Cognizant · Capgemini · Zoho · Oracle**
- Realistic fresher/early-career role descriptions (SDE, GenC, Elite/Turbo, Power Programmer, Member Technical Staff…)
- Searchable picker modal (by company, role, skill)
- One click → JD fills the analyzer → target pill + official careers link
- Every JD labeled **"representative"** — no fabricated official postings

**SPEAKER NOTES:**

This feature emerged from a simple demo-day question: a student wants to analyze their resume, but where do they get a job description? Making them hunt for one on LinkedIn kills the moment. So we preloaded twelve.

The picker modal presents each company as a card — a branded letter avatar, company name, the specific early-career role, location, and the top skill tags extracted from the description. The search box filters by company, role or skill: searching "python" surfaces the nine companies whose fresher roles expect it; searching "java" surfaces eight.

The roles are chosen to mirror how these companies actually hire freshers in India: Amazon SDE, Google Software Engineer early career, Meta frontend, Microsoft IDCS, the service-company tracks you have heard of — TCS Digital/Ninja, Infosys Power Programmer, Wipro Elite/Turbo, Cognizant GenC — plus product companies Zoho and Oracle. Each description captures that company's real emphasis: Amazon's leadership-principle language and DSA focus, TCS's Xplore learning commitments and shift flexibility, Cognizant's GenC/GenC-Next tiering with full-stack expectations, Zoho's end-to-end product ownership culture.

We made one deliberate integrity decision here that we want to highlight: these descriptions are labeled representative — modeled on each company's publicly known hiring patterns — and each card links to the company's official careers page, with the modal itself carrying a disclaimer. We did not scrape or fabricate "official Amazon job descriptions," because presenting invented text as an official posting would be a credibility risk in front of any judge, and teaching students to verify at the source is itself part of the product's mission.

The payoff was immediate in testing: the same resume scores seventy-five against a frontend JD but fifty-five against Amazon's — differentiated, honest, role-aware feedback from one click.

---

## SLIDE 18 — The Dashboard: Mission Control

**ON SLIDE:**

- Personalized welcome (name persists in browser)
- **Live service status dots** — main API · resume analyzer · roadmap engine
- Three feature cards + four quick actions
- Career progress widgets · saved-schemes preview · recent-activity feed
- Deep links: saved scheme on dashboard → opens its detail modal directly

**SPEAKER NOTES:**

The dashboard is the student's home base after the landing page, and it is engineered around one idea: at a glance, show me my state and what to do next.

The welcome section personalizes with the student's name — stored in their own browser, no account — and offers the two highest-value actions as primary buttons: analyze a resume, build a roadmap.

Below it sits the feature most demo audiences underestimate: the live service status row. Three dots report the real health of the system, refreshed from the backend's health endpoint: the main API, the resume analyzer's FastAPI process, and the roadmap engine's key configuration. When everything is green you see three green dots. If the Python service is stopped, its dot turns amber with the label "start Python service"; if the Groq key is missing, its dot says exactly that. This is the difference between a demo that dies mysteriously and a system that tells you its own state — operators call this observability, and we built it into a student-facing product because it doubles as a trust signal.

The middle grid presents the three feature cards with live metadata, and the lower panels make the platform feel alive: saved schemes previewed as tappable rows that deep-link straight into the scheme's detail modal via a URL parameter, a career-progress tracker, a recent-activity feed — every scheme view, analysis run, and roadmap generation is logged locally with relative timestamps like "5 minutes ago" — and a quick-actions grid that gets students to any tool in one click.

Empty states matter here too: new students see friendly guidance — "bookmark schemes from the Government Schemes page to track them here" — rather than empty boxes.

---

## SLIDE 19 — API Surface (Complete)

**ON SLIDE:**

```
GET  /api/health              service + integration status
GET  /api/schemes             list (?q= &category= &page= &sort=)
GET  /api/schemes/categories  filter categories
GET  /api/schemes/stats       counts by category & ministry
GET  /api/schemes/:id         single scheme (404 handled)
GET  /api/resume/jobs         preloaded company JDs (?q=)
GET  /api/resume/jobs/:id     single JD
POST /api/resume/analyze      PDF + JD → structured analysis
GET  /api/resume/health       analyzer connectivity
POST /api/roadmap/clarity     rule-based clarity score
POST /api/roadmap/generate    profile → decision + roadmap
```

- Consistent JSON errors: `{ "error": "human-readable message" }`
- Correct status codes: 400 validation · 404 missing · 502 upstream · 503 not configured · 504 timeout

**SPEAKER NOTES:**

This is the complete API surface — eleven endpoints — and it is worth showing because REST discipline is where integration projects usually rot.

Three design rules govern all of them. First: every response, success or failure, is JSON. Errors always take the same shape — an error field containing a human-readable sentence, never a stack trace and never an HTML error page. Second: status codes are used honestly. Validation failures are 400s with the specific missing field named; unknown scheme or job ids are 404s; when the FastAPI service is unreachable or misconfigured, clients get 503 with the fix described in the message; when an upstream LLM times out, clients get 504 with a retry suggestion; when the AI service itself returns garbage, that is a 502. Third: validation happens at the edge — every route checks its inputs before calling anything expensive, so a bad request costs microseconds, not an AI token.

The two health endpoints deserve a note. The main /api/health actually probes the resume analyzer over HTTP and checks the Groq key's presence, returning a services map — that is what powers the dashboard's status dots and our startup log. It turns "is it working?" from a guess into a query.

The roadmap endpoints mirror SkillRoute's contract deliberately: our clarity endpoint returns the identical JSON shape their route returns, and the generate endpoint returns their career_decision and learning_roadmap objects verbatim, augmented with the validated profile. If SkillRoute's team ever ships improvements, our payloads absorb them without frontend changes.

Finally: this surface is deliberately small. Eleven endpoints cover three features plus health. No speculative endpoints for future features — that is how you keep a prototype honest.

---

## SLIDE 20 — Frontend Engineering Details

**ON SLIDE:**

- 1 design system (styles.css) → 7 pages with zero UI library
- 28 hand-drawn SVG icons (icons.jsx) — zero icon packages
- Services layer: **every** fetch in one file (api.js)
- localStorage module: saved schemes · activity feed · student name
- States everywhere: skeleton loaders · spinners · empty states · error alerts
- Debounced search (350 ms) · modal focus/Escape/scroll-lock · responsive at 1020/860/640 px

**SPEAKER NOTES:**

Let me spend one slide on frontend craftsmanship, because "it's just a UI" is where projects quietly lose quality points.

The entire visual identity is a single stylesheet defining a token system: brand colors, four text shades, three shadow depths, two radii, and two font families — Sora for display type, Inter for body. Every component — buttons in five variants, four card types, badges, chips, form fields, alerts, modals, skeletons — is composed from those tokens. Change one variable and the whole product re-themes. That is what lets us say the UI is custom rather than template.

The icon set is twenty-eight SVGs we drew inline in one JSX file — stroke style, consistent twenty-four-unit grid — so there is no icon-font download and every icon inherits text color automatically.

Architecturally, one rule keeps the frontend sane: the browser never calls fetch directly. Every network call lives in the api service module — nine exported functions, each returning parsed JSON or a thrown, already-human-readable error. Components never parse status codes. The same discipline applies to localStorage through a small store module with safe JSON parsing — corrupt or missing storage degrades to defaults instead of crashing.

Interaction quality is in the details: scheme search is debounced at 350 milliseconds so the API isn't hammered per keystroke; every modal locks body scroll, closes on Escape and overlay-click, and manages focus; every list has a skeleton loading shape; every empty result has a designed empty state; the layout reflows at three breakpoints down to mobile, where the navbar collapses into a toggle menu.

And we silenced even the noisy parts: React Router's future-flag warnings are pre-opted-in, so the console is clean — because a clean console is part of the demo.

---

## SLIDE 21 — Error Handling & Resilience Matrix

**ON SLIDE:**

| Failure | System behavior |
|---|---|
| PDF is JPG / too big / empty | 400 with specific message, before upload |
| Scanned (no-text) PDF | "No readable text found" from pipeline |
| FastAPI service stopped | 503 + exact start command in the UI |
| API key missing | Named error: which file, which variable |
| Model retired (both providers!) | Auto-remapped via compatibility layer |
| LLM slow / hangs | 120 s timeout → 504 "please try again" |
| Backend down (frontend) | Fetch wrapper → "make sure backend is running on port 4000" |
| No search results | Designed empty state + keyword suggestions |
| localStorage disabled/corrupt | Safe fallback to defaults, no crash |

**SPEAKER NOTES:**

This matrix is the slide we most want engineers to remember, because it is what separates a demo from a product.

Walk through the resume flow with us: a student picks a JPG — blocked client-side with "unsupported file type" before a single byte moves. A PDF with no text layer — the pipeline detects it and explains the scanned-file problem. The Python service isn't running — the proxy health-checks first and the UI prints the exact command to fix it. The Gemini key was never added — the response names the file and variable to set. The LLM hangs — a 120-second timeout aborts with a retry message instead of a frozen spinner. Each of these we triggered deliberately during testing, and each produced its designed response — none produced a blank screen or a console stack trace.

The same discipline covers the roadmap flow: missing fields produce a joined, readable message naming every missing item at once, not one-at-a-time nagging; a missing Groq key surfaces with instructions; bridge subprocess failures — including Python not being installed at all — are caught and translated.

On the frontend, the fetch wrapper converts network failure into one consistent message, and every consumer renders it in a styled alert with contextual help. Empty search results, empty saved lists, empty activity feeds — all have designed states.

The model-compatibility row is worth savoring: both upstream repos broke against current provider APIs on day one, and our integration layer absorbed both failures without touching their code. That row is the slide's thesis — resilience is an architectural property, not a try/catch decoration.

---

## SLIDE 22 — Security & Privacy by Design

**ON SLIDE:**

- ❌ No accounts, passwords, or PII database to breach
- 📄 Resumes: processed **in memory**, never written to disk or DB
- 💾 Student state (saves, activity, name) = their own browser
- 🔑 Keys in gitignored `.env` files only — `backend/.env.example` sanitized
- 🌐 CORS locked to the frontend origin; Vite proxy in dev
- 📤 Outbound calls only to: Gemini API, Groq API, official gov/careers links

**SPEAKER NOTES:**

Security for this prototype is not a checklist bolted on at the end — the architecture removes most of the attack surface by simply not collecting anything.

There is no authentication system in this build, by scope decision — the SIH requirements explicitly excluded it. That absence is a privacy feature in this context: there is no password database to leak, no session tokens to steal, no profile data to sell. A student's saved schemes, their activity history, and even the name they type for personalization live in their own browser's localStorage. Close the tab and it is still theirs; nothing about their identity ever reaches our server.

The most sensitive data flow is the resume, and we handled it with in-memory processing end to end: the browser holds the File object, Express receives it into memory storage — multer's memoryStorage, not disk — forwards the bytes to the FastAPI service, which extracts text and discards the upload. No resume is ever written to a database, a queue, or persistent storage anywhere in the pipeline.

Secrets hygiene: both API keys live exclusively in gitignored .env files — we verified the ignore rules and also caught and cleaned one environment artifact where a template file had picked up a real key. The example env files shipped in the repo contain placeholders only. If this repo is ever pushed, keys cannot leak — and we recommend rotating the keys after the demo anyway, as good practice.

Network posture: CORS on the Express server is locked to the frontend's origin; the API keys exist only server-side and are never shipped to the browser; and outbound links to students are exclusively to official government domains and official careers pages.

For the production roadmap: real auth, encrypted resume storage with consent, and rate limiting are the first three items — because they become necessary exactly when we start storing things.

---

## SLIDE 23 — Verification & Testing Evidence

**ON SLIDE:**

**What we actually ran while building:**

- ✅ Vite production build passes — 44 modules, ~72 KB gzipped JS
- ✅ All 11 endpoints curl-tested: 200s, 400s, 404s, 503s as designed
- ✅ Full roadmap generated twice (API + browser): ML Engineer, 5 phases, 13 milestones, 39 real URLs, 0 placeholder links
- ✅ Resume analysis ×4 runs (incl. Amazon JD): scores 55–75, structured output parsed every time
- ✅ Clarity scoring parity: JS port = SkillRoute Python (58/100 on identical inputs)
- ✅ Browser click-through: all 7 pages, search/filter/save/modal flows, 0 console errors
- ✅ Parser unit-tested against a canonical 7-section report

**SPEAKER NOTES:**

Every claim on this slide is something we executed and observed — not aspiration.

Starting with the build: the frontend compiles to a production bundle of forty-four modules, roughly seventy-two kilobytes gzipped of JavaScript plus six of CSS — a size that means instant loads even on poor college Wi-Fi, and it builds in under two seconds.

The API layer: all eleven endpoints were exercised with curl, verifying the happy paths and, more importantly, the contract paths — validation returns 400 with named reasons, missing IDs return 404, unreachable services return 503 with the fix in the message, and the health endpoint correctly reflects each service's true state.

The AI features were tested with real keys, real LLM calls: the roadmap agent generated complete roadmaps on two separate runs — once over the API with a test profile and once through the browser UI — producing a Machine Learning Engineer decision with confidence and skill-match percentages, five phases, thirteen milestones, and thirty-nine resource links that we programmatically checked for placeholder or insecure URLs: zero found. The resume analyzer ran four full analyses, including the preloaded Amazon description, with the report parser correctly extracting scores, all six content sections, and the recommendation class every single time.

We also proved integration fidelity, not just function: SkillRoute's clarity scoring is rule-based, so we compared our JavaScript port against their Python on identical inputs — both produce 58 out of 100 with the same level classification. Same weights, same behavior.

Finally, the browser click-through: every page, every primary interaction — search, filters, save/unsave, modals, timeline progress toggles, drag-and-drop — exercised in the running app with an empty error console. The console-clean requirement sounds trivial; most demos fail it.

---

## SLIDE 24 — Local Development Experience

**ON SLIDE:**

```bash
npm run setup            # installs all 3 node workspaces

# python deps (once)
pip install fastapi uvicorn pypdf python-dotenv google-generativeai groq

# keys (once) — free tiers
resume-analyzer/backend/.env  → GEMINI_API_KEY=…
backend/.env                  → GROQ_API_KEY=…

# run
npm run dev              # backend :4000 + frontend :5173 together
cd resume-analyzer/backend && python run_server.py   # :8001
```

- README covers all of it: setup, keys, architecture, API, troubleshooting table

**SPEAKER NOTES:**

A judge should be able to run this project, so we optimized the local development experience aggressively — and documented it completely.

Setup is three commands. npm run setup installs all three Node workspaces from the root. One pip line installs the six Python packages across both engines — deliberately trimmed to what is actually imported, rather than the upstream repos' full pinned requirement files, which include heavy packages our integration path never touches. Then two tiny env files, each with one free-tier key from Google AI Studio and Groq's console.

Running the stack: npm run dev at the root starts the Express backend and the Vite frontend together with colored, prefixed logs via concurrently. The resume analyzer starts with one command from its folder — and note it uses our launcher script, which handles the model compatibility automatically, a subtlety the README calls out explicitly so nobody falls back to plain uvicorn and hits the retired-model error.

The README itself is written as an operator document, not a formality: a requirements table, the installation steps, per-service startup, where each key goes, an API reference table, the full architecture explanation of how both repositories are integrated, how the schemes data works and how to swap it for a database later, and a troubleshooting table mapping every error message a new teammate might hit to its fix — including the two model-retirement failure modes we personally fought.

Everything hot-reloads: edit a React component and Vite refreshes instantly; edit the Express server and node --watch restarts it; edit schemes.json and the change appears on the next request without any restart. For a team iterating on demo content the night before SIH, that loop speed matters more than any framework choice.

---

## SLIDE 25 — Impact & Beneficiaries

**ON SLIDE:**

| Beneficiary | What they get |
|---|---|
| 🎓 Students (Tier-2/3 colleges especially) | Honest resume feedback, a real plan, unclaimed schemes |
| 🏫 Colleges / placement cells | A ready tool to embed in training & placement workflows |
| 🏛️ Government | Scheme discoverability without new portal spend |
| 🏢 Industry | Better-prepared, better-matched fresher applicants |

**Why it scales for India:** zero sign-up, zero cost to run (free-tier AI), works on low bandwidth (72 KB bundle), mobile responsive.

**SPEAKER NOTES:**

Let us talk about who actually benefits, because features only matter through their users.

Students — and especially students in Tier-2 and Tier-3 colleges without strong placement ecosystems — get the three things a privileged metro student gets through networks: honest feedback on their resume before an ATS or recruiter silently rejects it; a concrete, personalized plan to reach a target career with free resources attached to every step; and visibility into government money and training they are entitled to but have never heard of. A student discovering AICTE's fifty-thousand-rupee Pragati scholarship through SkillSetu has gained something tangible from one visit.

Colleges and placement cells get a deployable tool: imagine this embedded in a college portal during pre-placement season — every final-year student runs their resume against the companies visiting campus this semester, against twelve preloaded JDs today and their placement cell's own JDs tomorrow. The architecture supports that without rework, since job descriptions are just data.

Government stakeholders get discoverability without spending a rupee on new portal infrastructure: the schemes already exist — PMIS, NSP, PMKVY, NATS — the missing layer is a student-facing surface that connects them to intent, and SkillSetu is exactly that layer, linking out to official portals rather than standing between the student and the state.

Industry gets better-prepared applicants: students who know what DSA depth Amazon expects, who have rewritten their bullets honestly, who arrive having followed a structured plan.

And the scaling argument that makes this credible for India: no accounts to provision, free-tier AI APIs meaning zero marginal cost per student, a seventy-two-kilobyte bundle that loads on weak connections, full mobile responsiveness, and English-first UI with a clear path to regional languages in the future scope.

---

## SLIDE 26 — What We Deliberately Did NOT Build

**ON SLIDE:**

Per scope: chatbot · job portal · placement tracker · complex auth · payments · blockchain · interview simulator · social features · admin panel · notifications · email

**Why saying no made the product better:**

- Every feature that exists is **finished, tested and demo-able**
- No "Coming Soon" buttons anywhere in the product
- Modular architecture = these become *additions*, not *rewrites*

**SPEAKER NOTES:**

This might be our most important slide, and it is about restraint.

The SIH requirements listed twelve features as future extensions and told us not to build them — chatbots, job portals, placement tracking, authentication, payments, blockchain, interview simulators, social networking, admin panels, notifications, email. We obeyed that list completely, and we want to explain why that obedience is a strength rather than a limitation.

First, finished beats started. Every feature in SkillSetu works end to end — you can press every button on every page and something real happens, backed by real AI or real data. There is not a single "Coming Soon" badge in the product. Compare that with the typical hackathon project: seven half-built features where two work. Judges remember the product where everything they clicked did what it claimed.

Second, depth compounds. The time not spent on a chatbot went into the things you have seen: a report parser that handles every score format Gemini emits, a compatibility layer that survived two provider model retirements, status dots that tell the truth, error messages that name the exact file to fix. Those details are what make it a product.

Third, and this is the architectural promise: saying no now does not mean saying no forever. Because all AI logic sits behind services, all data behind service layers, and the frontend behind a component system, the excluded features are additions, not rewrites. A job portal becomes a new data file plus a route file. Placement tracking becomes a localStorage or database extension of the existing progress model. Auth becomes middleware in Express and a small context in React. The seams are already in the codebase.

Scope discipline is how a prototype becomes a platform.

---

## SLIDE 27 — Future Roadmap

**ON SLIDE:**

**Next 3 months (post-SIH hardening):**
- SQLite persistence: roadmaps + phase progress survive reloads
- Regional language UI (Hindi first)
- DOCX resume support · PDF export of analysis & roadmap

**6–12 months (the SIH vision):**
- Internship & placement portal on the same API pattern
- College accounts: T&P officers push their own target JDs
- Auth + encrypted resume history (opt-in)
- Live scheme sync from official sources

**SPEAKER NOTES:**

Where does SkillSetu go after this presentation? We split the future honestly into what is near-term hardening versus the longer SIH vision.

The three-month horizon is about turning a flawless prototype into a durable product. Persistence first: roadmaps and phase completion currently live for the session; SQLite — already architected for via the service layer — makes a student's plan survive across visits, which is when the platform becomes a daily companion instead of a one-time check. Hindi localization next, because a career platform for India that only speaks English caps its own impact; the token-based design system makes translation a content problem, not a rebuild. Then DOCX resume support alongside PDF, and one-click PDF export of both the resume analysis and the roadmap — students want to take the plan to their mentors.

The six-to-twelve-month horizon is the full SIH problem statement. The internship and placement portal grows on the exact pattern you have seen: job descriptions are already data served by JSON; internships become another dataset with filters and save flow reusing every component that exists. College accounts arrive with authentication — T&P officers load their campus's actual visiting-company JDs, and the analyzer we showed against Amazon today runs against the companies actually coming to that college. Resume history returns as an opt-in encrypted feature once accounts exist, letting students track score improvement across a semester — a genuine motivational loop. And the schemes dataset graduates from our curated JSON to a scheduled sync with official sources, keeping twenty-five schemes fresh automatically.

Every item on this slide lands on seams that already exist in the code. That is the payoff of the modular architecture — the roadmap is a plan, not a wish.

---

## SLIDE 28 — Why SkillSetu Can Win

**ON SLIDE:**

1. **All three mandated features work — live** (not mockups)
2. **Real integration**: 2 upstream repos run unmodified inside our product
3. **Real engineering**: model-retirement patches, parser, resilience matrix
4. **Real data integrity**: verified official links, no fabricated claims
5. **Real DX**: 3-command setup, complete README, clean console
6. **Product feel**: custom design system, observability, empty states

**SPEAKER NOTES:**

As we near the demo, here is our honest case for why this project stands out — framed entirely as things you have already seen evidence for in the last twenty-seven slides.

One: completeness. The problem statement asked for three features, and all three work end to end right now, on free-tier keys, with real AI output. Nothing you will see in the demo is pre-baked.

Two: integration maturity. We treated the two open-source repositories as dependencies to honor, not code to copy. Their agent logic runs unchanged inside our product, with only layer-level patches where their providers evolved — and their upgrade path stays intact.

Three: engineering depth where it counts. The compatibility layer that absorbed two provider-side model retirements on day one; the report parser that turns prose into structured UI; the validation, timeout, and error-translation layers that turn a dozen failure modes into instructive messages. This is the invisible work that keeps systems alive outside slideshow conditions.

Four: data integrity as a principle. Twenty-five schemes with verified official portals, representative-not-fabricated company JDs, "check the official portal" wherever a number would go stale. In a government-context hackathon, credibility of information is a feature.

Five: developer experience as a judging criterion. Three commands to run, a README that documents everything including the war stories, and a production build that passes clean.

Six: product quality. A custom design system, service status observability in a student-facing dashboard, designed empty states, debounced search, modals that manage focus — the details that make users trust software.

We did not build the most features. We built the most finished product.

---

## SLIDE 29 — LIVE DEMO

**ON SLIDE:**

### The full student journey, live:

1. **Landing → Dashboard** — service status: all green
2. **Resume Analyzer** — upload resume → *Browse companies* → pick **Amazon** → analyze → score + gaps
3. **Career Roadmap** — fill profile → clarity check → generate → 5-phase plan with real resources → mark Phase 1 complete
4. **Government Schemes** — search "internship" → open PMIS → **Save** → dashboard shows it instantly
5. Q&A — ask us anything about the code; it is all local, all real

*Fallback plan: recorded demo + the health-check evidence from Slide 23.*

**SPEAKER NOTES:**

Now the part you have been waiting for — everything demonstrated live, on this machine, no internet tricks.

The journey follows one student's realistic arc. First the landing page and dashboard — pointing out the three green status dots that prove all engines are live before we rely on them.

Then the resume analyzer with a real resume PDF: drag it in, click Browse companies, search for Amazon, pick the SDE description, hit analyze. While the stepper runs — usually ten to forty seconds — we explain what Gemini is doing inside. Then the results: the score, the honest gaps, the ATS keywords, the rewritten bullets. If a judge hands us their own resume on a pen drive, we will run theirs instead.

Third the roadmap: a fresh profile — Python, HTML, some SQL, ten hours a week — clarity check showing the score, then generate. We let the audience watch the agent think for up to a minute, then walk the timeline it produces: the career decision with its confidence metrics, the five phases, the real resource links — opening one on YouTube to prove they are genuine — and marking Phase 1 complete to show the progress tracker move.

Fourth the schemes dashboard: search "internship," open the PM Internship Scheme, read its real benefits aloud, hit Save, then navigate to the Dashboard where it has appeared in saved schemes and the activity feed — the loop between discovery and tracking closing in front of everyone.

And then questions — we welcome them at the code level, because the whole stack is running locally in front of you. If venue internet fails, our fallback is the recorded run plus the test evidence from the verification slide: the analysis numbers and roadmap structure you would have seen are already documented there.

---

## SLIDE 30 — Thank You

**ON SLIDE:**

# SkillSetu
### Bridge the gap. Build the future.

**Stack:** React · Node/Express · FastAPI · Gemini · Groq
**Features:** AI Resume Analyzer · Career Roadmap · Gov Schemes · 12 Target Companies
**Status:** All features live & tested · 3-command setup · Zero running cost

*Team [Name] · [College] · Smart India Hackathon 2026*

**SPEAKER NOTES:**

Thank you for your attention.

Let us leave you with the one-sentence version of what we built: SkillSetu is a working bridge between what students have, what industry wants, and what the nation already offers — delivered as a finished product, not a promise.

Everything you saw runs on the machine in front of you: a React frontend, an Express API serving verified government data and twelve company job descriptions, and two open-source AI engines — one analyzing resumes with Gemini, one planning careers with a Groq-powered agent — integrated without modifying a line of their code, resilient enough to survive both AI providers changing their models under us during development.

It costs nothing per student, requires no sign-up, weighs seventy kilobytes, fits on a mobile screen, and is three commands away from running on any laptop in this room.

We believe this is what a Smart India Hackathon project should be: scoped honestly, engineered carefully, documented completely, and — above all — actually working.

We are happy to take questions on any layer: the design system, the parser, the bridge, the data curation, the patches, or where this goes next.

Thank you.

---

## Appendix A — Numbers Cheat-Sheet (for Q&A)

| Question | Answer |
|---|---|
| Total schemes in dataset | 25 (8 Scholarship, 4 Internship, 6 Skill Development, 4 Entrepreneurship, 1 Employment, 2 Students) |
| Ministries covered | 16 |
| Companies in JD library | 12 (Amazon, Google, Meta, Microsoft, TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Zoho, Oracle) |
| Roadmap output size | 4–6 phases · 2–3 milestones each · every milestone has 2–3 real resources |
| Verified roadmap run | ML Engineer · 78% confidence · 62% skill match · 5 phases · 13 milestones · 39 URLs · 0 placeholders |
| Verified resume runs | 75/100 (frontend JD) · 70/100 (UI run) · 55/100 (Amazon JD, "build more evidence") |
| Frontend bundle | ~72 KB gzipped JS + 6 KB CSS · builds in <2 s |
| Timeouts | 120 s AI calls · 4 s health probes |
| Ports | 5173 frontend · 4000 Express · 8001 FastAPI |
| Clarity parity test | JS port 58/100 = Python original 58/100 |
| Keys required | 2 (Gemini + Groq), both free tier |

## Appendix B — File Map (for deep-dive Q&A)

| Question | File |
|---|---|
| Server bootstrap, health, error handler | `backend/server.js` |
| Schemes list/search/filter/pagination | `backend/services/schemesService.js` + `backend/data/schemes.json` |
| Company JD library | `backend/services/jobsService.js` + `backend/data/jobDescriptions.json` |
| Resume proxy + report parser | `backend/services/integration.js` |
| Roadmap bridge (Node→Python) | `backend/services/roadmapBridge.js` + `backend/services/roadmap_bridge.py` |
| Groq model compatibility patch | `backend/services/roadmap_bridge.py` |
| Gemini model compatibility launcher | `resume-analyzer/backend/run_server.py` |
| SkillRoute agent (untouched upstream) | `roadmap/backend/app/services/roadmap_agent.py` |
| Analyzer core (untouched upstream) | `resume-analyzer/backend/app/resume_analyzer.py` |
| Frontend pages (7) | `frontend/src/pages/*.jsx` |
| All API calls | `frontend/src/services/api.js` |
| localStorage store | `frontend/src/services/localStore.js` |
| Design system | `frontend/src/styles.css` |
| Icons (28, inline SVG) | `frontend/src/components/icons.jsx` |
