#!/usr/bin/env bash
# SkillSetu launcher for macOS / Linux
set -e
cd "$(dirname "$0")"

echo "Starting SkillSetu services..."

# 1. Main backend (:4000)
npm run dev --prefix backend &
BACKEND_PID=$!

# 2. Resume analyzer (:8001)
(cd resume-analyzer/backend && python3 run_server.py) &
ANALYZER_PID=$!

# 3. Frontend (:5173)
npm run dev --prefix frontend &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $ANALYZER_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "All 3 services started. Open:  http://localhost:5173"
echo "Press Ctrl+C to stop everything."
echo ""

wait
