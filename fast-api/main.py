from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import logging
import openai

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Load .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Create OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    logging.error("❌ OPENAI_API_KEY not found in the .env file")
    raise RuntimeError("❌ OPENAI_API_KEY not found in the .env file")

client = openai.OpenAI(api_key=api_key)

# Initialize FastAPI application
app = FastAPI()
logging.info("🚀 FastAPI started.")

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow origin for frontend on localhost
    allow_credentials=True,  # Allow cookies and other credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)


# Define request model
class AIRequest(BaseModel):
    message: str  # User message to be sent to the AI


# Define response model
class AIResponse(BaseModel):
    response: str  # AI-generated response


# /ai endpoint
@app.post("/ai", response_model=AIResponse)
async def ai_response(request: AIRequest):
    logging.info(f"📩 Message received: {request.message}")

    try:
        # Send request to OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Use gpt-3.5-turbo model
            messages=[
                {"role": "system", "content": "You are a friendly assistant."},  # System role instruction
                {"role": "user", "content": request.message}  # User message
            ],
            temperature=0.7,  # Control randomness of responses
            max_tokens=200  # Limit maximum number of response tokens
        )

        # Extract and log the AI's response
        ai_message = response.choices[0].message.content.strip()
        logging.info(f"🤖 AI Response: {ai_message}")

        return AIResponse(response=ai_message)  # Return the response to the user

    except Exception as e:
        # Log and return any errors encountered
        logging.error(f"❌ OpenAI Error: {e}")
        return AIResponse(response=f"[AI ERROR]: {e}")
