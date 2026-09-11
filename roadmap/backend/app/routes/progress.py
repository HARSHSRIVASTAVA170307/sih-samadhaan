from fastapi import APIRouter, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from app.services.storage_service import update_phase_status, get_active_roadmap, save_active_roadmap
from app.services.roadmap_agent import adapt_roadmap
from app.utils.auth import verify_firebase_token

router = APIRouter(
    prefix="/api/progress",
    tags=["Progress"]
)

class ProgressUpdate(BaseModel):
    phase_index: int
    status: str

@router.post("/update")
def update_progress(
    update: ProgressUpdate,
    user_id: str = Depends(verify_firebase_token)
):
    success = update_phase_status(user_id, update.phase_index, update.status)
    if not success:
        raise HTTPException(status_code=404, detail="Roadmap or phase not found")
    
    return {"status": "success", "message": "Progress updated"}

@router.post("/adapt")
async def adapt_roadmap_route(
    user_id: str = Depends(verify_firebase_token)
):
    current_data = await run_in_threadpool(get_active_roadmap, user_id)
    if not current_data:
        raise HTTPException(status_code=404, detail="No active roadmap found")
    
    new_roadmap = await adapt_roadmap(current_data)
    
    await run_in_threadpool(
        save_active_roadmap,
        user_id, 
        current_data["career_decision"], 
        new_roadmap,
        preserve_progress=True
    )
    
    updated_data = await run_in_threadpool(get_active_roadmap, user_id)
    return {
        "status": "success",
        "career_decision": updated_data.get("career_decision"),
        "learning_roadmap": updated_data.get("learning_roadmap"),
        "progress": updated_data.get("progress")
    }
