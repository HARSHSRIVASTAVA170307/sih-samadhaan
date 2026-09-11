from pydantic import BaseModel, Field
from typing import Optional, Literal


class StudentProfile(BaseModel):
    name: str = Field(..., example="John Doe")
    education: str = Field(..., example="bachelors")
    skills: str = Field(..., example="Python, React, Data Analysis")
    interests: str = Field(..., example="Software Development, Data Science")
    goals: str = Field(..., example="Become a Senior Developer")
    experience: Optional[str] = Field(None, example="2 years as Junior Developer")
    time_per_week: Optional[int] = Field(
        None, ge=1, le=40,
        example=10,
        description="Hours per week available for learning"
    )
    learning_pace: Optional[Literal["slow", "medium", "fast"]] = Field(
        None, example="medium",
        description="Preferred learning pace"
    )
    clarity_score: Optional[int] = Field(
        None, ge=0, le=100,
        example=60,
        description="Career clarity score from assessment (0=exploring, 100=focused)"
    )


class ClarityAssessment(BaseModel):
    has_career_in_mind: Literal["yes", "somewhat", "no"] = Field(
        ..., example="somewhat",
        description="Does the student have a specific career in mind?"
    )
    familiarity_with_paths: Literal["very", "somewhat", "not_at_all"] = Field(
        ..., example="somewhat",
        description="How familiar is the student with tech career paths?"
    )
    primary_goal: Literal["internship", "full_time_job", "learning", "exploring"] = Field(
        ..., example="full_time_job",
        description="What is the student's primary goal?"
    )
