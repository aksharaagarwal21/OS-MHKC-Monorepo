"""
FastAPI entry point — Enhanced with Async support, 
History handling, and Proper Error Catching.
"""

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
from agents.base_agent import generate_response

# Initialize logger for real-time debugging during the hackathon
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MHKC Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    persona: str = "empathy"
    # Added history so the AI remembers the conversation
    history: List[ChatMessage] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    persona: str

@app.get("/health")
def health():
    return {"status": "ok", "engine": "Groq-Llama3"}

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        # 1. Convert Pydantic models to dicts for the LangChain logic
        history_dicts = [m.model_dump() for m in req.history]
        
        # 2. MUST use await here because generate_response is an async network call to Groq
        reply = await generate_response(req.message, req.persona, history_dicts)
        
        return ChatResponse(reply=reply, persona=req.persona)
    
    except Exception as e:
        logger.error(f"Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail="The AI is taking a breather. Try again?")
