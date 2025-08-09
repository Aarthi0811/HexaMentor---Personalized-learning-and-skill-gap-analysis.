from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum

class ModuleStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Module(BaseModel):
    id: str = Field(..., description="Unique module identifier")
    title: str = Field(..., description="Module title")
    description: str = Field(..., description="Module description")
    duration: str = Field(..., description="Estimated completion time")
    topics: List[str] = Field(..., description="List of topics covered")
    materials: List[str] = Field(..., description="Learning materials and resources")
    prerequisites: List[str] = Field(default_factory=list, description="Required prerequisites")
    completed: bool = Field(default=False, description="Completion status")
    progress: int = Field(default=0, description="Progress percentage", ge=0, le=100)

class LearningPath(BaseModel):
    id: str = Field(..., description="Unique learning path identifier")
    title: str = Field(..., description="Learning path title")
    description: str = Field(..., description="Path description")
    target_roles: List[str] = Field(..., description="Target job roles")
    estimated_duration: str = Field(..., description="Total estimated time")
    modules: List[Module] = Field(..., description="Learning modules")
    skill_gaps: Dict[str, float] = Field(..., description="Identified skill gaps with scores")

class LearningPathRequest(BaseModel):
    assessment_results: Dict[str, float] = Field(..., description="Assessment results with skill scores")
    target_roles: List[str] = Field(..., description="Target job roles")
    current_experience_level: str = Field(default="beginner", description="Current experience level")
    preferred_learning_style: Optional[str] = Field(default=None, description="Preferred learning approach")
    time_commitment: Optional[str] = Field(default="2-3 hours per week", description="Available time for learning")

class LearningPathResponse(BaseModel):
    learning_path: LearningPath
    recommendations: List[str] = Field(default_factory=list, description="Additional recommendations")
    metadata: dict = Field(default_factory=dict)