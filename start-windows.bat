@echo off
title SkillSetu - Launcher
echo.
echo  Starting SkillSetu services (3 windows will open, minimized)...
echo.
echo  [1/3] Main backend   :4000
start "SkillSetu Backend" /min cmd /k "npm run dev --prefix backend"
echo  [2/3] Resume analyzer:8001
start "SkillSetu Resume Analyzer" /min cmd /k "cd resume-analyzer\backend && python run_server.py"
echo  [3/3] Frontend       :5173
start "SkillSetu Frontend" /min cmd /k "npm run dev --prefix frontend"
echo.
echo  All 3 started. Give them ~5 seconds, then open:
echo.
echo      http://localhost:5173
echo.
echo  Keep the windows OPEN while using the app.
echo  To stop everything: close each window (or press Ctrl+C inside it).
pause
