-- ================= CAREERS =================
INSERT INTO careers (name, description) VALUES
('Full Stack JavaScript', 'End-to-end JavaScript web development'),
('Machine Learning', 'Data science and ML engineering path')
ON CONFLICT DO NOTHING;


-- ================= SKILLS =================
INSERT INTO skills (name, category) VALUES
('HTML/CSS', 'frontend'),
('JavaScript', 'frontend'),
('React', 'frontend'),
('Node.js', 'backend'),
('PostgreSQL', 'backend'),
('Deployment', 'devops'),
('Python', 'ml'),
('NumPy/Pandas', 'ml'),
('Data Visualization', 'ml'),
('ML Algorithms', 'ml'),
('Model Deployment', 'ml')
ON CONFLICT DO NOTHING;


-- ================= FULL STACK ROADMAP =================
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, 0, t.priority
FROM careers c
JOIN (
  VALUES
    ('HTML/CSS', 1),
    ('JavaScript', 2),
    ('React', 3),
    ('Node.js', 4),
    ('PostgreSQL', 5),
    ('Deployment', 6)
) AS t(skill_name, priority) ON TRUE
JOIN skills s ON s.name = t.skill_name
WHERE c.name = 'Full Stack JavaScript'
ON CONFLICT DO NOTHING;


-- ================= ML ROADMAP =================
INSERT INTO career_skills (career_id, skill_id, required_level, priority)
SELECT c.id, s.id, 0, t.priority
FROM careers c
JOIN (
  VALUES
    ('Python', 1),
    ('NumPy/Pandas', 2),
    ('Data Visualization', 3),
    ('ML Algorithms', 4),
    ('Model Deployment', 5)
) AS t(skill_name, priority) ON TRUE
JOIN skills s ON s.name = t.skill_name
WHERE c.name = 'Machine Learning'
ON CONFLICT DO NOTHING;
