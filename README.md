# OS-MHKC Monorepo — Mental Health Knowledge Companion

A full-stack mental health platform with multi-persona AI chat, patient/doctor/admin dashboards, and real-time collaboration.

## Architecture

| Layer | Tech | Port |
|-------|------|------|
| Frontend | Next.js 14 + Tailwind + Framer Motion | `3000` |
| Backend | Python FastAPI + LangChain + Groq | `8000` |
| Database | Supabase (Postgres + pgvector) | cloud |

## Quick Start

### 1. Backend (Python)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 3. Database

- Create a Supabase project at [supabase.com](https://supabase.com)
- Run `supabase/schema.sql` in the SQL Editor
- Run `supabase/seed.sql` to populate demo data

### Environment Variables

Create `.env` files in both `frontend/` and `backend/`:

**backend/.env**
```
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
frontend/    → Next.js app (pages, components, hooks, lib)
backend/     → FastAPI microservice (agents, core)
supabase/    → SQL schema & seed data
```

## Team

- **Person 1 & 4** — Frontend (Next.js)
- **Person 2** — Backend (FastAPI)
- **Person 3** — Database (Supabase)
