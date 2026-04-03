"""Mock vector retrieval logic for RAG demonstrations."""

# In production this would query pgvector via Supabase.
MOCK_ARTICLES = [
    {
        "id": 1,
        "title": "Understanding Anxiety",
        "content": "Anxiety is a normal emotion. However, when it becomes chronic...",
        "tags": ["anxiety", "cbt"],
    },
    {
        "id": 2,
        "title": "Mindfulness for Beginners",
        "content": "Mindfulness is the practice of being present in the moment...",
        "tags": ["mindfulness", "meditation"],
    },
    {
        "id": 3,
        "title": "Indian Cultural Perspectives on Mental Health",
        "content": "In many Indian communities, mental health awareness is growing...",
        "tags": ["cultural", "india"],
    },
]


def retrieve_context(query: str) -> str:
    """Return the first matching article content as context."""
    query_lower = query.lower()
    for article in MOCK_ARTICLES:
        if any(tag in query_lower for tag in article["tags"]):
            return article["content"]
    return MOCK_ARTICLES[0]["content"]
