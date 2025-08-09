from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class DifficultyLevel(str, Enum):
    BASIC = "basic"
    MEDIUM = "medium"
    ADVANCED = "advanced"

class Question(BaseModel):
    id: str = Field(..., description="Unique identifier for the question")
    skill: str = Field(..., description="The skill being tested")
    difficulty: DifficultyLevel = Field(..., description="Question difficulty level")
    question: str = Field(..., description="The actual question text")
    options: List[str] = Field(..., description="Multiple choice options", min_items=4, max_items=4)
    correct_answer: int = Field(..., description="Index of the correct answer (0-3)", ge=0, le=3)
    explanation: str = Field(..., description="Explanation of the correct answer")

class QuestionRequest(BaseModel):
    job_roles: List[str] = Field(..., description="List of job roles to generate questions for")
    skills: List[str] = Field(..., description="List of skills to focus on")
    difficulty_levels: List[DifficultyLevel] = Field(default=[DifficultyLevel.BASIC, DifficultyLevel.MEDIUM, DifficultyLevel.ADVANCED])
    count: int = Field(default=10, description="Number of questions to generate", ge=1, le=50)

class QuestionResponse(BaseModel):
    questions: List[Question]
    metadata: dict = Field(default_factory=dict)