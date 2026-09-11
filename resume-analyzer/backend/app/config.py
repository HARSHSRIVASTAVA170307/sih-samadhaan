import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
UPLOAD_DIR = "uploads"
GEMINI_MODEL_NAME = "gemini-2.5-flash-lite"