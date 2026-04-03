import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, SystemMessage
from agents.personas import SYSTEM_PROMPTS
from core.mock_db import retrieve_relevant_wiki_vectors

# Ensure GROQ_API_KEY is in your environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_temp_key_here")

async def generate_response(message: str, persona_id: str, history: list):
    # 1. Initialize LLM
    llm = ChatGroq(
        temperature=0.7,
        model_name="llama3-70b-8192",
        groq_api_key=GROQ_API_KEY
    )

    # 2. Get Persona & Mock RAG Context
    system_base = SYSTEM_PROMPTS.get(persona_id, SYSTEM_PROMPTS["empathy"])
    rag_context = retrieve_relevant_wiki_vectors(message, persona_id)

    # 3. Construct Prompt
    # We inject the RAG context directly into the system instructions for the LLM
    full_system_prompt = f"{system_base}\n\nUSE THIS COMMUNITY DATA TO INFORM YOUR RESPONSE:\n{rag_context}"
    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", full_system_prompt),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])

    # 4. Format History
    formatted_history = []
    for msg in history[-5:]:  # Keep last 5 exchanges for context
        if msg["role"] == "user":
            formatted_history.append(HumanMessage(content=msg["content"]))
        else:
            formatted_history.append(SystemMessage(content=msg["content"]))

    # 5. Chain and Invoke
    chain = prompt_template | llm
    
    response = await chain.ainvoke({
        "input": message,
        "history": formatted_history
    })

    return response.content
