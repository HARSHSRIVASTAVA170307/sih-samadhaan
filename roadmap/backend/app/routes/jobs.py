from fastapi import APIRouter, HTTPException, Depends, Query
from app.services.job_service import fetch_jobs
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


@router.get("/search")
async def search_jobs(
    career: str = Query(..., description="Career title to search jobs for"),
    limit: int = Query(10, ge=1, le=25),
    user_id: str = Depends(verify_firebase_token)
):
    try:
        result = await fetch_jobs(career, limit)
        return {
            "status": "success",
            **result
        }
    except Exception as e:
        print(f"Error searching jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))
