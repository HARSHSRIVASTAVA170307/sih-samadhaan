from fastapi import APIRouter, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from app.models.student import StudentProfile, ClarityAssessment
from app.services.roadmap_agent import generate_roadmap
from app.services.storage_service import save_career_analysis, get_active_roadmap
from app.services.matching_service import generate_career_insights, calculate_clarity_score
from app.utils.auth import verify_firebase_token
from datetime import datetime

router = APIRouter(
    prefix="/api/career",
    tags=["Career"]
)


@router.post("/clarity")
def assess_clarity(assessment: ClarityAssessment):
    """
    Rule-based clarity scoring — the Logic Layer.
    No auth required so it can be called during profile setup before roadmap generation.
    """
    try:
        result = calculate_clarity_score(assessment.dict())
        return {
            "status": "success",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/roadmap")
def get_current_roadmap(user_id: str = Depends(verify_firebase_token)):
    try:
        roadmap = get_active_roadmap(user_id)
        if not roadmap:
            return {"message": "No active roadmap found"}

        # Auto-adapt detection: check if progress is stalled
        needs_adaptation = False
        adaptation_reason = None

        progress = roadmap.get("progress", {})
        if not isinstance(progress, dict):
             progress = {}
             
        last_active = progress.get("last_activity_date")

        if last_active:
            try:
                last_date = datetime.fromisoformat(last_active).date()
                days_inactive = (datetime.utcnow().date() - last_date).days

                if days_inactive >= 3 and progress.get("completed_phases", 0) < progress.get("total_phases", 0):
                    needs_adaptation = True
                    adaptation_reason = f"No activity for {days_inactive} days. The agent can adapt your roadmap to get you back on track."
            except (ValueError, TypeError):
                pass

        roadmap["needs_adaptation"] = needs_adaptation
        roadmap["adaptation_reason"] = adaptation_reason

        return roadmap
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error getting roadmap: {str(e)}")


@router.post("/roadmap")
async def generate_career_roadmap(
    profile: StudentProfile,
    user_id: str = Depends(verify_firebase_token)
):
    try:
        profile_dict = profile.dict()

        result = await generate_roadmap(profile_dict)

        career_decision = result.get("career_decision", {})
        learning_roadmap = result.get("learning_roadmap", {})

        await run_in_threadpool(
            save_career_analysis,
            user_id=user_id,
            profile=profile_dict,
            career_decision=career_decision,
            roadmap=learning_roadmap
        )

        return {
            "status": "success",
            "user_id": user_id,
            "career_decision": career_decision,
            "learning_roadmap": learning_roadmap
        }

    except Exception as e:
        import traceback
        import os
        print(f"Error generating roadmap: {str(e)}")
        print(f"GROQ_API_KEY set: {bool(os.getenv('GROQ_API_KEY'))}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/insights")
async def get_career_insights(user_id: str = Depends(verify_firebase_token)):
    try:
        roadmap = get_active_roadmap(user_id)
        if not roadmap:
            return {"message": "No career decision found. Please generate a roadmap first."}

        career_decision = roadmap.get("career_decision", {})
        profile = roadmap.get("profile", {})
        insights = await generate_career_insights(profile, career_decision)

        return {
            "status": "success",
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alternatives")
def get_alternative_careers(user_id: str = Depends(verify_firebase_token)):
    try:
        roadmap = get_active_roadmap(user_id)
        if not roadmap:
            return {"message": "No career decision found"}

        career_decision = roadmap.get("career_decision", {})
        alternatives = career_decision.get("alternatives", [])

        return {
            "status": "success",
            "current_career": career_decision.get("career"),
            "alternatives": alternatives
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/roadmap")
def delete_roadmap(user_id: str = Depends(verify_firebase_token)):
    try:
        from app.services.storage_service import delete_active_roadmap

        success = delete_active_roadmap(user_id)
        if success:
            return {
                "status": "success",
                "message": "Career path reset successfully. You can now generate a new roadmap."
            }
        else:
            return {
                "status": "error",
                "message": "No roadmap found to delete"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
