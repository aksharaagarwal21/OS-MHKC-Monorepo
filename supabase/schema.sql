-- ============================================================
-- MHKC Supabase Schema — Tables, pgvector, and RLS policies
-- ============================================================

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ---- Users ----
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT,
  role       TEXT CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Mood Logs ----
CREATE TABLE IF NOT EXISTS mood_logs (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  score      INT CHECK (score BETWEEN 1 AND 10),
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Articles (Wiki Feed) ----
CREATE TABLE IF NOT EXISTS articles (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT,
  tags       TEXT[],
  embedding  VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Chat Messages ----
CREATE TABLE IF NOT EXISTS messages (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  persona    TEXT DEFAULT 'empathy',
  content    TEXT NOT NULL,
  role       TEXT CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---- Row Level Security ----
ALTER TABLE users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;

-- Users can only read their own row
CREATE POLICY "Users read own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Patients can insert & read their own mood logs
CREATE POLICY "Own mood logs" ON mood_logs
  FOR ALL USING (auth.uid() = user_id);

-- Users can read/write their own messages
CREATE POLICY "Own messages" ON messages
  FOR ALL USING (auth.uid() = user_id);

-- Articles are publicly readable
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public articles" ON articles
  FOR SELECT USING (true);

-- ================================
-- SAFE PATCH START (DO NOT DELETE ABOVE)
-- ================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  role user_role DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Patch articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES profiles(user_id);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  persona_id TEXT,
  conversation_log JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Emergency interventions
CREATE TABLE IF NOT EXISTS emergency_interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  flagged_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Embeddings table
CREATE TABLE IF NOT EXISTS wiki_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  embedding VECTOR(1024)
);

-- Index
CREATE INDEX IF NOT EXISTS wiki_embedding_index
ON wiki_embeddings
USING hnsw (embedding vector_cosine_ops);

-- Match function
CREATE OR REPLACE FUNCTION match_wiki_articles(
  query_embedding VECTOR(1024),
  match_threshold FLOAT
)
RETURNS TABLE (
  article_id BIGINT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    we.article_id,
    1 - (we.embedding <=> query_embedding) AS similarity
  FROM wiki_embeddings we
  WHERE 1 - (we.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT 5;
$$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_interventions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY IF NOT EXISTS "Profile self access"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Own chat sessions"
ON chat_sessions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admin emergency access"
ON emergency_interventions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Auto profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================
-- SAFE PATCH END
-- ================================