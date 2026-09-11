import os
import shutil

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import UPLOAD_DIR
from app.pdf_loader import extract_text_from_pdf
from app.resume_analyzer import analyze_resume_match
from app.schemas import AnalysisResponse, HealthResponse


app = FastAPI(
    title="AI Resume Match Analyzer",
    description="An AI-powered resume-to-job-description matching assistant.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "message": "AI Resume Match Analyzer backend is running"
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, resume.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    resume_text = extract_text_from_pdf(file_path)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="No readable text found in the uploaded resume."
        )

    result = analyze_resume_match(resume_text, job_description)

    return {
        "result": result
    }