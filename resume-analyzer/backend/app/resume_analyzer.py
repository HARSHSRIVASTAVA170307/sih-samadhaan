import google.generativeai as genai

from app.config import GEMINI_API_KEY, GEMINI_MODEL_NAME


if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def build_resume_match_prompt(resume_text: str, job_description: str) -> str:
    return f"""
You are an AI resume screening assistant.

Analyze the resume against the job description.

Rules:
1. Be practical and specific.
2. Do not invent experience that is not in the resume.
3. Identify gaps honestly.
4. Suggest improvements suitable for a fresher or early-career candidate.
5. Keep the output structured and recruiter-friendly.
6. Do not use fake metrics or placeholders such as X%, Y minutes, or N users.

Return the analysis in this format:

1. Overall Match Score:
Give a score out of 100 and a short reason.

2. Strong Matches:
List skills, projects, experience, or keywords from the resume that match the job description.

3. Missing or Weak Areas:
List missing skills, tools, or experience expected by the job description.

4. ATS Keywords to Add:
List relevant keywords from the job description that should be added only if the candidate genuinely has exposure.

5. Resume Improvement Suggestions:
Give specific suggestions to improve the resume for this role.

6. Improved Resume Bullets:
Rewrite 3-5 resume bullets to better match this job description without exaggerating. Do not include numbers or metrics unless they are clearly present in the resume.

7. Final Recommendation:
Say whether the candidate should apply now, apply after small edits, or build more evidence first.

Resume:
{resume_text}

Job Description:
{job_description}
"""


def analyze_resume_match(resume_text: str, job_description: str) -> str:
    if not GEMINI_API_KEY:
        return "Gemini API key is missing. Please add GEMINI_API_KEY in the .env file."

    prompt = build_resume_match_prompt(resume_text, job_description)

    try:
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text

    except Exception as error:
        return f"Gemini API error with model '{GEMINI_MODEL_NAME}': {str(error)}"