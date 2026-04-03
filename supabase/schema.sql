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
