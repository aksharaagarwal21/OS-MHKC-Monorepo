"""FastAPI entry point — CORS, health-check, and /api/v1/chat route."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.base_agent import generate_response

app = FastAPI(title="MHKC Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    persona: str = "empathy"  # empathy | cbt | cultural


class ChatResponse(BaseModel):
    reply: str
    persona: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = generate_response(req.message, req.persona)
    return ChatResponse(reply=reply, persona=req.persona)
