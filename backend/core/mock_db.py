"""Mock vector retrieval logic for RAG demonstrations."""

# In production this would query pgvector via Supabase.
MOCK_ARTICLES = [
    {
        "id": 1,
        "title": "Understanding Anxiety",
        "content": "Anxiety is a normal emotion. For students, it often manifests as physical tension or racing thoughts about the future.",
        "tags": ["anxiety", "cbt", "stress", "placement", "exam"],
    },
    {
        "id": 2,
        "title": "Mindfulness for Beginners",
        "content": "Mindfulness involves the '5-4-3-2-1' grounding technique: noticing 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you can taste.",
        "tags": ["mindfulness", "meditation", "grounding", "panic"],
    },
    {
        "id": 3,
        "title": "Indian Cultural Perspectives",
        "content": "In South Asian contexts, communal support and family 'chai sessions' are traditional ways of coping with external academic pressures.",
        "tags": ["cultural", "india", "family", "pressure", "desi"],
    },
]

def retrieve_context(query: str) -> str:
    """
    Simulates a vector search by keyword matching.
    Returns formatted context strings for the LLM to use.
    """
    query_lower = query.lower()
    matches = []

    for article in MOCK_ARTICLES:
        if any(tag in query_lower for tag in article["tags"]):
            matches.append(f"[{article['title']}]: {article['content']}")

    if not matches:
        return f"General Info: {MOCK_ARTICLES[0]['content']}"

    return "\n".join(matches)
