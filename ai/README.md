# AI Question & Learning Path Generator

This service provides AI-powered assessment question generation and personalized learning path creation using Google's Gemini AI.

## Features

- **AI Question Generation**: Generate relevant assessment questions based on job roles and skills
- **Personalized Learning Paths**: Create customized learning paths based on assessment results
- **Multiple Difficulty Levels**: Support for basic, medium, and advanced questions
- **Job Role Targeting**: Questions and paths tailored to specific job roles
- **RESTful API**: FastAPI-based service with comprehensive documentation

## Setup

### Prerequisites

- Python 3.8+
- Google Gemini API key

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# Create .env file in the ai/ directory
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8001
ENVIRONMENT=development
```

3. Run the service:
```bash
python main.py
```

The service will be available at `http://localhost:8001`

## API Documentation

### Endpoints

#### Generate Questions
```
POST /api/v1/generate-questions
```

Request body:
```json
{
  "job_roles": ["Frontend Developer", "React Developer"],
  "skills": ["JavaScript", "React", "HTML/CSS"],
  "difficulty_levels": ["basic", "medium", "advanced"],
  "count": 10
}
```

#### Generate Learning Path
```
POST /api/v1/generate-learning-path
```

Request body:
```json
{
  "assessment_results": {
    "JavaScript": 45.0,
    "React": 60.0,
    "Python": 30.0
  },
  "target_roles": ["Frontend Developer"],
  "current_experience_level": "beginner",
  "time_commitment": "2-3 hours per week"
}
```

#### Health Check
```
GET /api/v1/health
```

#### Get Available Skills
```
GET /api/v1/skills
```

#### Get Available Job Roles
```
GET /api/v1/job-roles
```

## Integration

This service is designed to integrate with the existing Express.js backend and React frontend. The main backend can proxy requests to this AI service or the frontend can call it directly.

### Example Integration

```javascript
// Frontend integration example
const generateQuestions = async (jobRoles, skills) => {
  const response = await fetch('http://localhost:8001/api/v1/generate-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_roles: jobRoles,
      skills: skills,
      count: 10
    })
  });
  
  return response.json();
};
```

## Architecture

```
ai/
├── api/           # API routes and endpoints
├── models/        # Pydantic models for request/response
├── services/      # AI service implementations
├── utils/         # Helper functions and utilities
├── config.py      # Configuration management
├── main.py        # FastAPI application entry point
└── requirements.txt
```

## Error Handling

The service includes comprehensive error handling with proper HTTP status codes and detailed error messages. All errors are logged for debugging purposes.

## Security

- Environment variables for sensitive configuration
- CORS configured for frontend integration
- Input validation using Pydantic models
- Comprehensive logging for monitoring