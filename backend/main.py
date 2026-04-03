"""FastAPI entry point — CORS, health-check, and /api/v1/chat route."""

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from agents.base_agent import generate_response

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
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    persona: str = "empathy"  # empathy | cbt | cultural
    history: List[ChatMessage] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    persona: str

@app.get("/health")
def health():
    return {"status": "ok", "engine": "Groq-Llama3-Async"}

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        # Convert Pydantic history objects to dicts for LangChain
        history_dicts = [m.model_dump() for m in req.history]
        
        # Await the async logic call
        reply = await generate_response(req.message, req.persona, history_dicts)
        
        return ChatResponse(reply=reply, persona=req.persona)
    except Exception as e:
        logger.error(f"Chat Route Error: {str(e)}")
        raise HTTPException(status_code=500, detail="The AI is taking a breather. Try again.")
