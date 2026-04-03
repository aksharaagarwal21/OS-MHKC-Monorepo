-- SAFE SEED (NON-DESTRUCTIVE)

-- Insert demo articles if none exist
INSERT INTO articles (title, body, tags)
SELECT 'Anxiety Basics', 'Understanding anxiety...', ARRAY['anxiety']
WHERE NOT EXISTS (SELECT 1 FROM articles);

INSERT INTO articles (title, body, tags)
SELECT 'Depression Help', 'Ways to cope...', ARRAY['depression']
WHERE NOT EXISTS (SELECT 1 FROM articles);