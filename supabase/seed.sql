-- ============================================================
-- Seed data — Dummy users, articles, and mood entries
-- ============================================================

-- Demo users (passwords managed by Supabase Auth, these are DB rows only)
INSERT INTO users (email, full_name, role) VALUES
  ('patient@demo.com',  'Aarav Sharma',   'patient'),
  ('doctor@demo.com',   'Dr. Priya Patel', 'doctor'),
  ('admin@demo.com',    'Neha Gupta',      'admin');

-- Sample articles
INSERT INTO articles (title, body, tags) VALUES
  ('Understanding Anxiety',
   'Anxiety is a natural response to stress. Learn about coping mechanisms including deep breathing, grounding techniques, and progressive muscle relaxation.',
   ARRAY['anxiety', 'coping']),
  ('Mindfulness Meditation 101',
   'Mindfulness meditation involves paying attention to the present moment without judgement. Start with 5 minutes daily and gradually increase.',
   ARRAY['mindfulness', 'meditation']),
  ('Breaking the Stigma in India',
   'Mental health awareness in India is growing. Organizations like NIMHANS and iCall are leading the charge to make therapy accessible.',
   ARRAY['cultural', 'india', 'stigma']),
  ('CBT Thought Records',
   'A thought record helps you identify automatic negative thoughts, evaluate evidence, and develop balanced alternatives.',
   ARRAY['cbt', 'techniques']);

-- Sample mood logs (will reference first user once created via auth)
-- These use a placeholder UUID; replace with real user IDs after auth setup.
