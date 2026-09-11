from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
from app.services.quiz_agent import generate_quiz, evaluate_quiz
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/quiz",
    tags=["Quiz"]
)


class QuizGenerateRequest(BaseModel):
    skills: List[str]


class QuizEvaluateRequest(BaseModel):
    questions: List[dict]
    answers: Dict[str, str]


@router.post("/generate")
async def generate_skill_quiz(
    request: QuizGenerateRequest,
    user_id: str = Depends(verify_firebase_token)
):
    try:
        if not request.skills or len(request.skills) == 0:
            raise HTTPException(status_code=400, detail="At least one skill is required")

        result = await generate_quiz(request.skills)
        return {
            "status": "success",
            "quiz": result
        }
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate_skill_quiz(
    request: QuizEvaluateRequest,
    user_id: str = Depends(verify_firebase_token)
):
    try:
        result = await evaluate_quiz(request.questions, request.answers)
        return {
            "status": "success",
            "evaluation": result
        }
    except Exception as e:
        print(f"Error evaluating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))
