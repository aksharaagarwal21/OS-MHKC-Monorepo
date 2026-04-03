from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from agents.base_agent import generate_response

app = FastAPI(title="OS-MHKC Backend - Logic Layer")

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    persona_id: str  # 'empathy', 'cbt', or 'cultural'
    chat_history: List[Dict[str, str]] = []

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = await generate_response(
            message=request.message,
            persona_id=request.persona_id,
            history=request.chat_history
        )
        return {"status": "success", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "online", "model": "llama3-70b-via-groq"}
