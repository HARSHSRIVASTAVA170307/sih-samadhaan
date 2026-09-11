from fastapi import APIRouter, HTTPException, Depends
from app.models.student import StudentProfile
from app.services.storage_service import get_student_profile, save_student_profile
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.get("/profile")
def get_profile(user_id: str = Depends(verify_firebase_token)):
    try:
        profile = get_student_profile(user_id)
        if not profile:
            return {"message": "No profile found"}
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile")
def save_profile(
    profile: StudentProfile,
    user_id: str = Depends(verify_firebase_token)
):
    try:
        print(f"Saving profile for user: {user_id}")
        print(f"Profile data: {profile.dict()}")
        
        if not profile.name or not profile.name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        if not profile.education or not profile.education.strip():
            raise HTTPException(status_code=400, detail="Education level is required")
        if not profile.skills or not profile.skills.strip():
            raise HTTPException(status_code=400, detail="At least one skill is required")
        if not profile.interests or not profile.interests.strip():
            raise HTTPException(status_code=400, detail="At least one interest is required")
        if not profile.goals or not profile.goals.strip():
            raise HTTPException(status_code=400, detail="Career goals are required")
        
        save_student_profile(user_id, profile.dict())
        print(f"Profile saved successfully for user: {user_id}")
        
        return {
            "status": "success",
            "message": "Profile saved successfully",
            "profile": profile.dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error saving profile for user {user_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")
