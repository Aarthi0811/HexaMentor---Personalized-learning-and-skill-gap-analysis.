import google.generativeai as genai
import json
import logging
from typing import List, Dict, Any, Optional
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        """Initialize Gemini service with API key"""
        genai.configure(api_key=config.GEMINI_API_KEY)
        # Using gemini-1.5-flash which is a free tier model
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
    async def generate_questions(self, job_roles: List[str], skills: List[str], 
                               difficulty_levels: List[str], count: int = 10) -> List[Dict[str, Any]]:
        """Generate assessment questions using Gemini AI"""
        try:
            prompt = self._build_question_prompt(job_roles, skills, difficulty_levels, count)
            
            response = self.model.generate_content(prompt)
            questions_data = self._parse_json_response(response.text)
            
            return self._format_questions(questions_data, skills)
            
        except Exception as e:
            logger.error(f"Error generating questions: {str(e)}")
            raise Exception(f"Failed to generate questions: {str(e)}")
    
    async def generate_learning_path(self, assessment_results: Dict[str, float], 
                                   target_roles: List[str], experience_level: str = "beginner",
                                   time_commitment: str = "2-3 hours per week") -> Dict[str, Any]:
        """Generate personalized learning path using Gemini AI"""
        try:
            prompt = self._build_learning_path_prompt(assessment_results, target_roles, 
                                                    experience_level, time_commitment)
            
            response = self.model.generate_content(prompt)
            learning_path_data = self._parse_json_response(response.text)
            
            return self._format_learning_path(learning_path_data, assessment_results, target_roles)
            
        except Exception as e:
            logger.error(f"Error generating learning path: {str(e)}")
            raise Exception(f"Failed to generate learning path: {str(e)}")
    
    def _build_question_prompt(self, job_roles: List[str], skills: List[str], 
                              difficulty_levels: List[str], count: int) -> str:
        """Build prompt for question generation"""
        skills_str = ", ".join(skills)
        roles_str = ", ".join(job_roles)
        levels_str = ", ".join(difficulty_levels)
        
        return f"""
Generate {count} technical assessment questions for the following:
- Job Roles: {roles_str}
- Skills: {skills_str}
- Difficulty Levels: {levels_str}

Requirements:
1. Questions should be relevant to the specified job roles
2. Cover all mentioned skills proportionally
3. Include a mix of difficulty levels
4. Each question must have exactly 4 multiple choice options
5. Provide clear explanations for correct answers
6. Make questions practical and job-relevant

Return the response as a JSON array with the following structure:
[
  {{
    "skill": "JavaScript",
    "difficulty": "basic",
    "question": "What is the correct way to declare a variable in JavaScript?",
    "options": ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
    "correct_answer": 0,
    "explanation": "Variables in JavaScript can be declared using var, let, or const keywords."
  }}
]

Generate diverse, practical questions that test real-world knowledge needed for {roles_str} positions.
"""

    def _build_learning_path_prompt(self, assessment_results: Dict[str, float], 
                                  target_roles: List[str], experience_level: str,
                                  time_commitment: str) -> str:
        """Build prompt for learning path generation"""
        
        # Identify weak skills (score < 70)
        weak_skills = [skill for skill, score in assessment_results.items() if score < 70]
        strong_skills = [skill for skill, score in assessment_results.items() if score >= 70]
        
        roles_str = ", ".join(target_roles)
        weak_skills_str = ", ".join(weak_skills) if weak_skills else "None identified"
        strong_skills_str = ", ".join(strong_skills) if strong_skills else "None identified"
        
        return f"""
Create a personalized learning path for someone targeting {roles_str} positions.

Assessment Results:
- Weak Skills (need improvement): {weak_skills_str}
- Strong Skills: {strong_skills_str}
- Experience Level: {experience_level}
- Time Commitment: {time_commitment}

Generate a comprehensive learning path with 4-6 modules focusing on:
1. Improving weak skills first
2. Advanced concepts for strong skills
3. Job-specific skills for target roles
4. Soft skills relevant to the roles

Return response as JSON with this structure:
{{
  "title": "Personalized Learning Path for [Target Roles]",
  "description": "Comprehensive path to improve skills and land [target roles] positions",
  "estimated_duration": "8-12 weeks",
  "modules": [
    {{
      "title": "Master JavaScript Fundamentals",
      "description": "Build strong foundation in JavaScript programming",
      "duration": "2-3 weeks",
      "topics": [
        "Variables and Data Types",
        "Functions and Scope",
        "Objects and Arrays",
        "ES6+ Features",
        "Asynchronous Programming"
      ],
      "materials": [
        "Interactive coding exercises",
        "Video tutorials",
        "Practice projects",
        "Code challenges"
      ],
      "prerequisites": []
    }}
  ],
  "recommendations": [
    "Focus on hands-on projects",
    "Practice coding daily",
    "Build a portfolio"
  ]
}}

Make the path practical, progressive, and tailored to the assessment results and target roles.
"""

    def _parse_json_response(self, response_text: str) -> Any:
        """Parse JSON response from Gemini, handling potential formatting issues"""
        try:
            # Clean up the response text
            cleaned_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            cleaned_text = cleaned_text.strip()
            
            return json.loads(cleaned_text)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response text: {response_text}")
            raise Exception("Invalid JSON response from AI model")
    
    def _format_questions(self, questions_data: List[Dict], skills: List[str]) -> List[Dict[str, Any]]:
        """Format and validate generated questions"""
        formatted_questions = []
        
        for i, q in enumerate(questions_data):
            try:
                formatted_q = {
                    "id": f"ai-q-{i+1}",
                    "skill": q.get("skill", skills[0] if skills else "General"),
                    "difficulty": q.get("difficulty", "medium"),
                    "question": q.get("question", ""),
                    "options": q.get("options", []),
                    "correct_answer": q.get("correct_answer", 0),
                    "explanation": q.get("explanation", "")
                }
                
                # Validate question format
                if (len(formatted_q["options"]) == 4 and 
                    0 <= formatted_q["correct_answer"] <= 3 and
                    formatted_q["question"].strip()):
                    formatted_questions.append(formatted_q)
                    
            except Exception as e:
                logger.warning(f"Skipping malformed question {i+1}: {e}")
                continue
        
        return formatted_questions
    
    def _format_learning_path(self, learning_path_data: Dict, assessment_results: Dict[str, float], 
                            target_roles: List[str]) -> Dict[str, Any]:
        """Format and validate generated learning path"""
        try:
            formatted_modules = []
            modules = learning_path_data.get("modules", [])
            
            for i, module in enumerate(modules):
                formatted_module = {
                    "id": f"ai-module-{i+1}",
                    "title": module.get("title", f"Module {i+1}"),
                    "description": module.get("description", ""),
                    "duration": module.get("duration", "2-3 weeks"),
                    "topics": module.get("topics", []),
                    "materials": module.get("materials", []),
                    "prerequisites": module.get("prerequisites", []),
                    "completed": False,
                    "progress": 0
                }
                formatted_modules.append(formatted_module)
            
            # Identify skill gaps (scores below 70)
            skill_gaps = {skill: score for skill, score in assessment_results.items() if score < 70}
            
            return {
                "id": "ai-learning-path-1",
                "title": learning_path_data.get("title", f"Learning Path for {', '.join(target_roles)}"),
                "description": learning_path_data.get("description", "AI-generated personalized learning path"),
                "target_roles": target_roles,
                "estimated_duration": learning_path_data.get("estimated_duration", "8-12 weeks"),
                "modules": formatted_modules,
                "skill_gaps": skill_gaps
            }
            
        except Exception as e:
            logger.error(f"Error formatting learning path: {e}")
            raise Exception("Failed to format learning path data")

# Global instance
gemini_service = GeminiService()