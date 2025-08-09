import google.generativeai as genai
import os

# Configure with your API key
API_KEY = "AIzaSyDQdYWHjwKCSYSs5WIr1O_yzx5ZxYk5Y9o"
genai.configure(api_key=API_KEY)

try:
    # List available models
    print("Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"- {model.name}")
    
    # Try to use gemini-1.5-flash
    print("\nTesting gemini-1.5-flash...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, can you generate a simple test question about JavaScript?")
    print("Response:", response.text)
    
except Exception as e:
    print(f"Error: {e}")
    
    # Try alternative models
    try:
        print("\nTrying gemini-1.5-pro...")
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content("Hello, can you generate a simple test question about JavaScript?")
        print("Response:", response.text)
    except Exception as e2:
        print(f"Error with gemini-1.5-pro: {e2}")
        
        try:
            print("\nTrying gemini-pro...")
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content("Hello, can you generate a simple test question about JavaScript?")
            print("Response:", response.text)
        except Exception as e3:
            print(f"Error with gemini-pro: {e3}") 