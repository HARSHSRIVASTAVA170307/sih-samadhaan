"""
Python bridge between the Node.js backend and the SkillRoute repository.

Instead of duplicating SkillRoute's AI logic, this script imports the
repository's own roadmap agent directly:

    roadmap/backend/app/services/roadmap_agent.py  ->  generate_roadmap()

Only the Firebase-auth-protected HTTP routes are bypassed (this prototype has
no authentication). The AI agent's prompt, retry logic and resource fallbacks
are used exactly as they exist in the repository.
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)                 # backend/
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)             # project root
SKILLROUTE_BACKEND = os.path.join(PROJECT_ROOT, "roadmap", "backend")

# Make `app.services.roadmap_agent` (SkillRoute's package) importable.
sys.path.insert(0, SKILLROUTE_BACKEND)

# ---------------------------------------------------------------------------
# Groq model compatibility patch
#
# SkillRoute's agent hardcodes the model `llama-3.3-70b-versatile`, which Groq
# has since retired (404 model_not_found for new API keys). To keep the
# repository code 100% unmodified, the Groq SDK's chat-completions resource is
# monkey-patched at the API-client level: any request for a retired model is
# transparently remapped to a currently available model before it reaches the
# network. If Groq retires the replacement too, set GROQ_MODEL in backend/.env
# (see `curl https://api.groq.com/openai/v1/models`).
# ---------------------------------------------------------------------------
GROQ_MODEL_OVERRIDE = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
RETIRED_MODEL_PREFIXES = ("llama-3.3-70b", "llama2-70b", "mixtral-8x7b")

try:
    from groq.resources.chat import completions as _groq_completions

    _orig_create = _groq_completions.AsyncCompletions.create

    def _patched_create(self, *, model=None, **kwargs):
        if isinstance(model, str) and model.startswith(RETIRED_MODEL_PREFIXES):
            model = GROQ_MODEL_OVERRIDE
        return _orig_create(self, model=model, **kwargs)

    _groq_completions.AsyncCompletions.create = _patched_create
except Exception as _patch_error:  # pragma: no cover
    print(
        json.dumps({"error": f"Could not patch Groq client for model compatibility: {_patch_error}"})
    )
    sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "missing JSON payload argument"}))
        return 1

    try:
        request = json.loads(sys.argv[1])
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"invalid JSON payload: {exc}"}))
        return 1

    action = request.get("action", "")
    payload = request.get("payload", {})

    # The Groq key is set for the Node process and must be visible to the
    # SkillRoute agent, which reads os.environ itself.
    if not os.environ.get("GROQ_API_KEY"):
        print(json.dumps({"error": "GROQ_API_KEY is not configured on the backend"}))
        return 1

    try:
        from app.services.roadmap_agent import generate_roadmap

        if action == "generate_roadmap":
            import asyncio

            result = asyncio.run(generate_roadmap(payload))
            print(json.dumps({"ok": True, "result": result}))
            return 0

        print(json.dumps({"error": f"unknown action: {action}"}))
        return 1

    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
