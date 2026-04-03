"""Core LangChain generation logic using Groq LLM."""

from core.config import GROQ_API_KEY
from agents.personas import get_system_prompt
from core.mock_db import retrieve_context

# Try to use LangChain + Groq if the key is available; otherwise fall back to
# a simple echo-style response so the app still runs without an API key.

_llm = None

if GROQ_API_KEY:
    try:
        from langchain_groq import ChatGroq

        _llm = ChatGroq(
            model="llama3-8b-8192",
            api_key=GROQ_API_KEY,
            temperature=0.7,
        )
    except Exception:
        _llm = None


def generate_response(user_message: str, persona: str = "empathy") -> str:
    """Generate a therapeutic response for *user_message* using *persona*."""
    system_prompt = get_system_prompt(persona)
    context = retrieve_context(user_message)

    if _llm is not None:
        from langchain_core.messages import SystemMessage, HumanMessage

        messages = [
            SystemMessage(content=f"{system_prompt}\n\nContext: {context}"),
            HumanMessage(content=user_message),
        ]
        result = _llm.invoke(messages)
        return result.content

    # Fallback when no API key is configured
    return (
        f"[{persona.upper()} mode] I hear you. "
        f"You said: \"{user_message}\". "
        "I'm here to support you — please configure a GROQ_API_KEY for full AI responses."
    )
