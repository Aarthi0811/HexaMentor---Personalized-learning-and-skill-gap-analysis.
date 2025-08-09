from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from models.question import QuestionRequest, QuestionResponse
from models.learning_path import LearningPathRequest, LearningPathResponse
from services.gemini_service import gemini_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: QuestionRequest):
    """
    Generate AI-powered assessment questions based on job roles and skills
    """
    try:
        logger.info(f"Generating {request.count} questions for roles: {request.job_roles}, skills: {request.skills}")
        
        questions = await gemini_service.generate_questions(
            job_roles=request.job_roles,
            skills=request.skills,
            difficulty_levels=[level.value for level in request.difficulty_levels],
            count=request.count
        )
        
        if not questions:
            raise HTTPException(status_code=500, detail="Failed to generate questions")
        
        return QuestionResponse(
            questions=questions,
            metadata={
                "generated_count": len(questions),
                "requested_count": request.count,
                "job_roles": request.job_roles,
                "skills": request.skills
            }
        )
        
    except Exception as e:
        logger.error(f"Error in generate_questions endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/generate-learning-path", response_model=LearningPathResponse)
async def generate_learning_path(request: LearningPathRequest):
    """
    Generate AI-powered personalized learning path based on assessment results
    """
    try:
        logger.info(f"Generating learning path for roles: {request.target_roles}")
        
        learning_path_data = await gemini_service.generate_learning_path(
            assessment_results=request.assessment_results,
            target_roles=request.target_roles,
            experience_level=request.current_experience_level,
            time_commitment=request.time_commitment
        )
        
        if not learning_path_data:
            raise HTTPException(status_code=500, detail="Failed to generate learning path")
        
        # Calculate additional recommendations based on assessment results
        recommendations = _generate_recommendations(request.assessment_results, request.target_roles)
        
        return LearningPathResponse(
            learning_path=learning_path_data,
            recommendations=recommendations,
            metadata={
                "assessment_skills": list(request.assessment_results.keys()),
                "target_roles": request.target_roles,
                "experience_level": request.current_experience_level,
                "modules_count": len(learning_path_data.get("modules", []))
            }
        )
        
    except Exception as e:
        logger.error(f"Error in generate_learning_path endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Question & Learning Path Generator"}

@router.get("/skills")
async def get_available_skills():
    """Get list of available skills for question generation"""
    skills = [
        "JavaScript", "Python", "React", "Node.js", "Express.js",
        "TypeScript", "HTML/CSS", "Git", "Database Design", "SQL",
        "MongoDB", "PostgreSQL", "API Development", "Testing",
        "System Design", "Algorithms", "Data Structures",
        "DevOps", "Docker", "AWS", "Communication", "Problem Solving"
    ]
    return {"skills": skills}

@router.get("/job-roles")
async def get_available_job_roles():
    """Get list of available job roles"""
    job_roles = [
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "React Developer", "Node.js Developer", "Python Developer",
        "Software Engineer", "Web Developer", "DevOps Engineer",
        "Data Analyst", "UI/UX Designer", "Product Manager"
    ]
    return {"job_roles": job_roles}

def _generate_recommendations(assessment_results: dict, target_roles: List[str]) -> List[str]:
    """Generate additional recommendations based on assessment results"""
    recommendations = []
    
    # Analyze weak areas
    weak_skills = [skill for skill, score in assessment_results.items() if score < 50]
    moderate_skills = [skill for skill, score in assessment_results.items() if 50 <= score < 75]
    
    if weak_skills:
        recommendations.append(f"Focus heavily on {', '.join(weak_skills[:3])} - these are critical gaps")
    
    if moderate_skills:
        recommendations.append(f"Strengthen {', '.join(moderate_skills[:2])} to reach proficiency")
    
    # Role-specific recommendations
    if "Frontend" in ' '.join(target_roles):
        recommendations.append("Build a portfolio with responsive web projects")
        recommendations.append("Practice modern CSS frameworks and JavaScript ES6+")
    
    if "Backend" in ' '.join(target_roles):
        recommendations.append("Focus on API design and database optimization")
        recommendations.append("Learn about system scalability and security best practices")
    
    if "Full Stack" in ' '.join(target_roles):
        recommendations.append("Create end-to-end projects demonstrating both frontend and backend skills")
    
    # General recommendations
    recommendations.extend([
        "Dedicate time to coding practice daily",
        "Contribute to open-source projects",
        "Network with professionals in your target field",
        "Stay updated with latest industry trends and technologies"
    ])
    
    return recommendations[:6]  # Limit to 6 recommendations