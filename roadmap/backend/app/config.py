import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_NAME = os.getenv("PROJECT_NAME", "SkillRoute")
ENV = os.getenv("ENV", "development")
