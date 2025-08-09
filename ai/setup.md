# AI Service Setup Guide

## Prerequisites

1. **Python 3.8+** installed
2. **Google Gemini API Key** - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Create Virtual Environment (Recommended)

```bash
cd ai
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

Create a `.env` file in the `ai/` directory:

```bash
# Copy from the example
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=8001
ENVIRONMENT=development
```

### 4. Start the AI Service

```bash
python main.py
```

The service will start on `http://localhost:8001`

## Testing the Service

### Health Check
```bash
curl http://localhost:8001/api/v1/health
```

### Generate Questions
```bash
curl -X POST http://localhost:8001/api/v1/generate-questions \
  -H "Content-Type: application/json" \
  -d '{
    "job_roles": ["Frontend Developer"],
    "skills": ["JavaScript", "React"],
    "count": 5
  }'
```

### Generate Learning Path
```bash
curl -X POST http://localhost:8001/api/v1/generate-learning-path \
  -H "Content-Type: application/json" \
  -d '{
    "assessment_results": {"JavaScript": 45, "React": 60},
    "target_roles": ["Frontend Developer"],
    "current_experience_level": "beginner"
  }'
```

## API Documentation

Once the service is running, visit:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## Integration with Backend

The Express.js backend automatically connects to this AI service. Make sure:

1. AI service is running on port 8001
2. Backend has the environment variable: `AI_SERVICE_URL=http://localhost:8001`

## Troubleshooting

### Common Issues

1. **Import Error**: Make sure you're in the virtual environment
2. **API Key Error**: Verify your Gemini API key is correct
3. **Port Conflict**: Change the PORT in `.env` if 8001 is occupied
4. **CORS Issues**: The service is configured for frontend origins localhost:3000 and localhost:5173

### Logs

Check the console output for detailed error messages and API request logs.

## Production Deployment

For production:

1. Set `ENVIRONMENT=production` in `.env`
2. Use a proper WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```
3. Set up proper monitoring and logging
4. Use environment variables for sensitive configuration