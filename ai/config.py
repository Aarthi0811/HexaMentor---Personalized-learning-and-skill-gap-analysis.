import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Try to get from environment first, fallback to hardcoded value
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDQdYWHjwKCSYSs5WIr1O_yzx5ZxYk5Y9o")
    PORT = int(os.getenv("PORT", 8001))
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # Validation
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is required")

config = Config()