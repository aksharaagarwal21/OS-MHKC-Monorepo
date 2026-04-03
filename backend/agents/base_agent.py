"""Core LangChain generation logic using Groq LLM."""

import logging
from core.config import GROQ_API_KEY
from agents.personas import get_system_prompt
from core.mock_db import retrieve_context

logger = logging.getLogger(__name__)

_llm = None

if GROQ_API_KEY:
    try:
        from langchain_groq import ChatGroq
        _llm = ChatGroq(
            model="llama3-70b-8192", # Upgraded for better reasoning
            api_key=GROQ_API_KEY,
            temperature=0.7,
        )
    except Exception as e:
        logger.error(f"Failed to initialize Groq: {e}")
        _llm = None

async def generate_response(user_message: str, persona: str = "empathy", history: list = []) -> str:
    """
    Generate a therapeutic response asynchronously.
    Supports chat history and RAG context injection.
    """
    system_prompt = get_system_prompt(persona)
    context = retrieve_context(user_message)

    if _llm is not None:
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

        # 1. Start with the System Prompt + RAG Context
        messages = [
            SystemMessage(content=f"{system_prompt}\n\nRelevant Wiki Info: {context}")
        ]

        # 2. Append history (keeping it slim for speed)
        for msg in history[-6:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

        # 3. Append the current message
        messages.append(HumanMessage(content=user_message))

        try:
            # Use ainvoke for non-blocking I/O
            result = await _llm.ainvoke(messages)
            return result.content
        except Exception as e:
            logger.error(f"Groq Inference Error: {e}")
            return "I'm having a momentary lapse in connection. How else can I support you?"

    # Fallback when no API key is configured
    return (
        f"[{persona.upper()} mode] I'm listening. "
        f"You said: \"{user_message}\". "
        "(Note: Real-time AI is disabled. Please check GROQ_API_KEY environment variable.)"
    )
