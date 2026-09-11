from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    result: str


class HealthResponse(BaseModel):
    status: str
    message: str