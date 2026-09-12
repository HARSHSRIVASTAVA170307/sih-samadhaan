# SkillSetu — Run Doc

## 1. Reproduce uncommitted artifacts (fresh checkout)

1. **Dependencies** (root, backend, frontend `node_modules`):
   ```
   npm run setup
   ```
2. **Python deps** (used by both AI services):
   ```
   pip install fastapi "uvicorn[standard]" pypdf python-dotenv google-generativeai groq python-multipart
   ```
3. **Env files** — copy from the main checkout (never commit these):
   - `backend/.env` — holds `GROQ_API_KEY` (SkillRoute roadmap engine)
   - `resume-analyzer/backend/.env` — holds `GEMINI_API_KEY` (resume analyzer)
   - Templates: `backend/.env.example`, `resume-analyzer/backend/.env.example`

## 2. Run the servers (3 services)

| Service | Port | Command |
|---|---|---|
| Express backend | 4000 | `npm run dev --prefix backend` |
| Vite frontend | 5173 | `npm run dev --prefix frontend` |
| Resume analyzer (FastAPI) | 8001 | `cd resume-analyzer/backend && python run_server.py` |

- Combined (backend + frontend in one terminal): `npm run dev` from the root.
- Windows one-click: `start-windows.bat` in the project root.
- **Important:** start the analyzer with `python run_server.py`, never `uvicorn app.main:app` — the launcher overrides the retired Gemini model ID and guards against a stray `PORT=0` env var.
- App URL: http://localhost:5173 — the Dashboard's 3 green status dots confirm all services are up.
- Health probe: `curl localhost:4000/api/health` → expect `"backend":true,"resumeAnalyzer":true,"roadmapEngine":true`.
- If ports are busy (`EADDRINUSE`), kill leftovers: `taskkill //F //IM node.exe` and `taskkill //F //IM python.exe`, then restart.
