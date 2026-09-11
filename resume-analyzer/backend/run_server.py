"""
Launcher for the AI Resume Match Analyzer backend.

The repository hardcodes GEMINI_MODEL_NAME = "gemini-2.5-flash-lite" in
app/config.py, which Google has blocked for new API keys (404: "no longer
available to new users"). To keep the repository code unmodified, this launcher
overrides the config value BEFORE app.main (and therefore app.resume_analyzer)
is imported, so the analyzer picks up a currently available model.

Usage:
    python run_server.py            # uses GEMINI_MODEL env var or the default below
    GEMINI_MODEL=gemini-2.5-flash python run_server.py
"""

import os

import app.config  # import first: patch before app.main pulls in resume_analyzer

app.config.GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

import uvicorn  # noqa: E402
from app.main import app  # noqa: E402

if __name__ == "__main__":
    try:
        port = int(os.getenv("PORT", "8001"))
    except ValueError:
        port = 8001
    if port <= 0:
        port = 8001
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=port)
