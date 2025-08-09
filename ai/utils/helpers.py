import json
import logging
from typing import Any, Dict, List, Optional
import re

logger = logging.getLogger(__name__)

def clean_json_response(response: str) -> str:
    """Clean AI response text to extract valid JSON"""
    # Remove markdown code blocks
    cleaned = re.sub(r'```json\s*', '', response)
    cleaned = re.sub(r'```\s*$', '', cleaned)
    
    # Remove any leading/trailing whitespace
    cleaned = cleaned.strip()
    
    return cleaned

def validate_question_format(question: Dict[str, Any]) -> bool:
    """Validate that a question has the required format"""
    required_fields = ['question', 'options', 'correct_answer', 'explanation']
    
    # Check required fields exist
    for field in required_fields:
        if field not in question:
            return False
    
    # Validate options (should be exactly 4)
    if not isinstance(question['options'], list) or len(question['options']) != 4:
        return False
    
    # Validate correct_answer (should be 0-3)
    if not isinstance(question['correct_answer'], int) or not (0 <= question['correct_answer'] <= 3):
        return False
    
    # Validate question and explanation are non-empty strings
    if not isinstance(question['question'], str) or not question['question'].strip():
        return False
    
    if not isinstance(question['explanation'], str) or not question['explanation'].strip():
        return False
    
    return True

def validate_learning_path_format(learning_path: Dict[str, Any]) -> bool:
    """Validate that a learning path has the required format"""
    required_fields = ['title', 'description', 'modules']
    
    # Check required fields exist
    for field in required_fields:
        if field not in learning_path:
            return False
    
    # Validate modules
    if not isinstance(learning_path['modules'], list):
        return False
    
    for module in learning_path['modules']:
        if not validate_module_format(module):
            return False
    
    return True

def validate_module_format(module: Dict[str, Any]) -> bool:
    """Validate that a module has the required format"""
    required_fields = ['title', 'description', 'topics']
    
    # Check required fields exist
    for field in required_fields:
        if field not in module:
            return False
    
    # Validate topics is a list
    if not isinstance(module['topics'], list):
        return False
    
    return True

def filter_questions_by_difficulty(questions: List[Dict[str, Any]], 
                                 difficulty_levels: List[str]) -> List[Dict[str, Any]]:
    """Filter questions by difficulty levels"""
    return [q for q in questions if q.get('difficulty', '').lower() in [d.lower() for d in difficulty_levels]]

def distribute_questions_by_skill(questions: List[Dict[str, Any]], 
                                skills: List[str], 
                                target_count: int) -> List[Dict[str, Any]]:
    """Distribute questions evenly across skills"""
    if not skills or target_count <= 0:
        return questions[:target_count]
    
    questions_per_skill = max(1, target_count // len(skills))
    result = []
    
    for skill in skills:
        skill_questions = [q for q in questions if q.get('skill', '').lower() == skill.lower()]
        result.extend(skill_questions[:questions_per_skill])
        
        if len(result) >= target_count:
            break
    
    # Fill remaining slots with any available questions
    if len(result) < target_count:
        remaining_questions = [q for q in questions if q not in result]
        result.extend(remaining_questions[:target_count - len(result)])
    
    return result[:target_count]

def calculate_skill_improvements(assessment_results: Dict[str, float], 
                               target_threshold: float = 75.0) -> Dict[str, float]:
    """Calculate how much each skill needs to improve to reach target threshold"""
    improvements = {}
    
    for skill, score in assessment_results.items():
        if score < target_threshold:
            improvements[skill] = target_threshold - score
    
    return improvements

def prioritize_learning_modules(modules: List[Dict[str, Any]], 
                              skill_gaps: Dict[str, float]) -> List[Dict[str, Any]]:
    """Prioritize learning modules based on skill gaps"""
    def get_priority_score(module: Dict[str, Any]) -> float:
        title = module.get('title', '').lower()
        description = module.get('description', '').lower()
        
        score = 0.0
        for skill, gap in skill_gaps.items():
            skill_lower = skill.lower()
            if skill_lower in title or skill_lower in description:
                score += gap
        
        return score
    
    # Sort modules by priority score (highest first)
    sorted_modules = sorted(modules, key=get_priority_score, reverse=True)
    return sorted_modules

def generate_progress_estimates(modules: List[Dict[str, Any]], 
                              time_commitment: str = "2-3 hours per week") -> List[Dict[str, Any]]:
    """Generate realistic progress estimates for modules"""
    # Parse time commitment
    hours_per_week = 2.5  # Default
    if "1-2" in time_commitment:
        hours_per_week = 1.5
    elif "3-4" in time_commitment:
        hours_per_week = 3.5
    elif "5+" in time_commitment:
        hours_per_week = 6.0
    
    updated_modules = []
    for module in modules:
        # Estimate module duration based on topics and complexity
        topics_count = len(module.get('topics', []))
        estimated_hours = max(8, topics_count * 3)  # Minimum 8 hours per module
        
        weeks_needed = max(1, round(estimated_hours / hours_per_week))
        duration_text = f"{weeks_needed} week{'s' if weeks_needed > 1 else ''}"
        
        updated_module = module.copy()
        updated_module['duration'] = duration_text
        updated_module['estimated_hours'] = estimated_hours
        
        updated_modules.append(updated_module)
    
    return updated_modules