-- ============================================================
-- EduPath AI - Complete Seed Data (10+ rows per table)
-- Auto-runs on Spring Boot startup (idempotent with ON CONFLICT)
-- Passwords are plain-text; DataSeeder auto-hashes with BCrypt.
-- ============================================================

-- =====================
-- 1. USERS (13 users: 10 students + 2 counselors + 1 admin)
-- =====================
INSERT INTO users (id, email, name, password, role, status) VALUES
  (1,  'ali@gmail.com',       'Ali',       '123456', 'STUDENT',   'ACTIVE'),
  (2,  'sheila@gmail.com',    'Sheila',    '123456', 'COUNSELOR', 'ACTIVE'),
  (3,  'heng@gmail.com',      'Heng',      '345765', 'ADMIN',     'ACTIVE'),
  (4,  'mei@gmail.com',       'Mei Ling',  '123456', 'STUDENT',   'ACTIVE'),
  (5,  'raj@gmail.com',       'Raj Kumar', '123456', 'STUDENT',   'ACTIVE'),
  (6,  'sarah@gmail.com',     'Sarah Tan', '123456', 'STUDENT',   'ACTIVE'),
  (7,  'ahmad@gmail.com',     'Ahmad',     '123456', 'STUDENT',   'ACTIVE'),
  (8,  'nurul@gmail.com',     'Nurul Ain', '123456', 'STUDENT',   'ACTIVE'),
  (9,  'jason@gmail.com',     'Jason Lee', '123456', 'STUDENT',   'ACTIVE'),
  (10, 'priya@gmail.com',     'Priya',     '123456', 'STUDENT',   'ACTIVE'),
  (11, 'david@gmail.com',     'David Wong','123456', 'STUDENT',   'ACTIVE'),
  (12, 'farah@gmail.com',     'Farah',     '123456', 'STUDENT',   'ACTIVE'),
  (13, 'karen@gmail.com',     'Karen Lim', '123456', 'COUNSELOR', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 2. ACADEMIC ASSESSMENT (10 rows for 10 students)
-- =====================
INSERT INTO academic_assessment (academic_assessmentid, malay_grade, english_grade, moral_grade, history_grade, mathematic_grade, science_grade, add_math_grade, physic_grade, chemistry_grade, biology_grade, chinese_grade, business_grade, accounting_grade, economic_grade, art_grade, computer_grade) VALUES
  (1,  'A', 'A', 'A', 'B', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'A', 'A', 'A', '0', 'A'),
  (2,  'B', 'A', 'A', 'A', 'B', 'A', 'B', 'B', 'A', 'A', 'A', '0', '0', '0', 'A', '0'),
  (3,  'A', 'B', 'B', 'A', 'A', 'B', 'A', 'A', 'B', 'C', '0', 'B', 'A', 'A', '0', 'A'),
  (4,  'B', 'A', 'A', 'B', 'A', 'A', 'A', 'B', 'A', 'A', 'B', 'A', 'B', 'A', '0', 'B'),
  (5,  'A', 'A', 'B', 'C', 'B', 'B', 'C', 'C', 'B', 'B', '0', 'A', 'A', 'A', 'B', '0'),
  (6,  'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '0', '0', '0', '0', '0', 'A'),
  (7,  'B', 'B', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'C', 'B', 'B', 'B', '0', 'B'),
  (8,  'A', 'A', 'A', 'A', 'B', 'A', 'B', 'A', 'A', 'A', 'A', '0', '0', '0', 'A', '0'),
  (9,  'C', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'C', 'C', '0', 'A', 'A', 'B', '0', 'C'),
  (10, 'A', 'A', 'A', 'B', 'A', 'A', 'A', 'A', 'B', 'A', 'B', 'A', 'A', 'A', 'A', 'A')
ON CONFLICT (academic_assessmentid) DO NOTHING;

-- =====================
-- 3. PERSONALITY ASSESSMENT (7 rows — students 8,9,10 have none = "Pending")
-- Totals: >=350 = On Track, <350 = At Risk, no assessment = Pending
INSERT INTO personality_assessment (personality_assessmentid, realistic_mark, investigate_mark, artistic_mark, social_mark, enterprising_mark, conventional_mark) VALUES
  (1,  68, 55, 32, 92, 89, 77),
  (2,  60, 51, 64, 95, 82, 77),
  (3,  85, 78, 25, 45, 60, 90),
  (4,  20, 35, 30, 40, 25, 45),
  (5,  15, 28, 40, 35, 30, 20),
  (6,  92, 90, 40, 50, 70, 85),
  (7,  25, 30, 45, 50, 35, 28)
ON CONFLICT (personality_assessmentid) DO NOTHING;

-- =====================
-- 4. STUDENT PROFILE (10 rows)
-- =====================
INSERT INTO student_profile (id, description, gender, academic_assessmentid, personality_assessmentid) VALUES
  (1,  'From SMK Tinggi Batu Pahat',                    'M', 1,  1),
  (2,  'From SMJK Chung Hua Miri',                      'F', 2,  2),
  (3,  'From SMK Sultanah Bahiyah Alor Setar',           'M', 3,  3),
  (4,  'From SMK Convent Bukit Nanas KL',                'F', 4,  4),
  (5,  'From SMK Methodist ACS Ipoh',                    'M', 5,  5),
  (6,  'From SMK Seri Puteri Cyberjaya',                 'F', 6,  6),
  (7,  'From SMK Agama Kuala Lumpur',                    'M', 7,  7),
  (8,  'From SMK Perempuan Sri Aman PJ',                 'F', 8,  NULL),
  (9,  'From SMK La Salle Petaling Jaya',                'M', 9,  NULL),
  (10, 'From SMK Taman SEA Petaling Jaya',               'F', 10, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. Link Users -> StudentProfile (student_profile_id FK on users table)
UPDATE users SET student_profile_id = 1  WHERE id = 1  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 2  WHERE id = 4  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 3  WHERE id = 5  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 4  WHERE id = 6  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 5  WHERE id = 7  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 6  WHERE id = 8  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 7  WHERE id = 9  AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 8  WHERE id = 10 AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 9  WHERE id = 11 AND student_profile_id IS NULL;
UPDATE users SET student_profile_id = 10 WHERE id = 12 AND student_profile_id IS NULL;

-- =====================
-- 6. COUNSELOR PROFILE (2 rows)
-- =====================
INSERT INTO counselor_profile (id, certificate, description, gender, userid) VALUES
  (1, 'certificate1.png',  'Graduate in Sunway University, Licensed Counselor',            'F', 2),
  (2, 'certificate2.png',  'MA in Educational Psychology from UM, Registered Counselor',   'F', 13)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 7. ADMIN PROFILE (1 row)
-- =====================
INSERT INTO admin_profile (adminid, description, gender, userid) VALUES
  (1, 'Graduate from Asia Pacific University of Technology & Innovation (APU)', 'M', 3)
ON CONFLICT (adminid) DO NOTHING;

-- =====================
-- 8. PATHWAY (10 rows)
-- =====================
INSERT INTO pathway (pathwayid, pathway_name) VALUES
  (1,  'Software Engineer Pathway'),
  (2,  'Accountant Pathway'),
  (3,  'Medical Doctor Pathway'),
  (4,  'Graphic Designer Pathway'),
  (5,  'Data Scientist Pathway'),
  (6,  'Civil Engineer Pathway'),
  (7,  'Business Analyst Pathway'),
  (8,  'Pharmacist Pathway'),
  (9,  'Architect Pathway'),
  (10, 'Cybersecurity Specialist Pathway')
ON CONFLICT (pathwayid) DO NOTHING;

-- =====================
-- 9. CAREER (10 rows)
-- =====================
INSERT INTO career (careerid, name, risk, salary) VALUES
  (1,  'Data Science',           '15%', 'RM 4500 - RM 6000'),
  (2,  'Software Engineering',   '35%', 'RM 3800 - RM 5500'),
  (3,  'Medical Doctor',         '5%',  'RM 5000 - RM 12000'),
  (4,  'Graphic Designer',       '45%', 'RM 2800 - RM 4500'),
  (5,  'Accountant',             '20%', 'RM 3500 - RM 6000'),
  (6,  'Civil Engineer',         '25%', 'RM 3800 - RM 7000'),
  (7,  'Business Analyst',       '30%', 'RM 4000 - RM 6500'),
  (8,  'Pharmacist',             '10%', 'RM 4500 - RM 8000'),
  (9,  'Architect',              '28%', 'RM 3500 - RM 7500'),
  (10, 'Cybersecurity Analyst',  '12%', 'RM 5000 - RM 9000')
ON CONFLICT (careerid) DO NOTHING;

-- =====================
-- 10. CAREER PATHWAY (12 rows — linking careers to pathways)
-- =====================
INSERT INTO career_pathway (id, created_date, careerid, pathwayid) VALUES
  (1,  '2026-04-21', 1,  5),
  (2,  '2026-04-21', 2,  1),
  (3,  '2026-04-22', 3,  3),
  (4,  '2026-04-22', 4,  4),
  (5,  '2026-04-23', 5,  2),
  (6,  '2026-04-23', 6,  6),
  (7,  '2026-04-24', 7,  7),
  (8,  '2026-04-24', 8,  8),
  (9,  '2026-04-25', 9,  9),
  (10, '2026-04-25', 10, 10),
  (11, '2026-04-26', 1,  1),
  (12, '2026-04-26', 2,  5)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 11. UNIVERSITY (10 rows — real Malaysian universities)
-- =====================
INSERT INTO university (id, address, name) VALUES
  (1,  'Kuala Lumpur',      'University of Malaya'),
  (2,  'Subang Jaya',       'Taylor University'),
  (3,  'Kuala Lumpur',      'Asia Pacific University (APU)'),
  (4,  'Nilai',             'INTI International University'),
  (5,  'Cyberjaya',         'Multimedia University (MMU)'),
  (6,  'Kampar',            'Universiti Tunku Abdul Rahman (UTAR)'),
  (7,  'Penang',            'Universiti Sains Malaysia (USM)'),
  (8,  'Serdang',           'Universiti Putra Malaysia (UPM)'),
  (9,  'Skudai',            'Universiti Teknologi Malaysia (UTM)'),
  (10, 'Bangi',             'Universiti Kebangsaan Malaysia (UKM)')
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 12. UNIVERSITY PATHWAY (12 rows)
-- =====================
INSERT INTO university_pathway (id, created_date, pathway_id, university_id) VALUES
  (1,  '2026-04-22', 1,  1),
  (2,  '2026-04-23', 1,  2),
  (3,  '2026-04-23', 2,  6),
  (4,  '2026-04-24', 3,  1),
  (5,  '2026-04-24', 4,  2),
  (6,  '2026-04-25', 5,  3),
  (7,  '2026-04-25', 6,  9),
  (8,  '2026-04-26', 7,  4),
  (9,  '2026-04-26', 8,  7),
  (10, '2026-04-27', 9,  5),
  (11, '2026-04-27', 10, 3),
  (12, '2026-04-28', 1,  5)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 13. COURSES (12 rows)
-- =====================
INSERT INTO courses (id, course_name, riasec_category, university_id) VALUES
  (1,  'BSc Computer Science',            'Investigative', 1),
  (2,  'BA Graphic Design',               'Artistic',      2),
  (3,  'Bachelor of Medicine (MBBS)',      'Investigative', 1),
  (4,  'BSc Information Technology',       'Investigative', 3),
  (5,  'Bachelor of Accounting',           'Conventional',  6),
  (6,  'BEng Civil Engineering',           'Realistic',     9),
  (7,  'BSc Data Science',                 'Investigative', 5),
  (8,  'Bachelor of Pharmacy',             'Investigative', 7),
  (9,  'Bachelor of Architecture',         'Artistic',      5),
  (10, 'BSc Cybersecurity',               'Investigative', 3),
  (11, 'BBA Business Administration',      'Enterprising',  4),
  (12, 'BSc Software Engineering',         'Investigative', 9)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 14. SUBJECT (14 rows — entry requirements per course)
-- =====================
INSERT INTO subject (id, grade, name, course_id) VALUES
  (1,  'A', 'Additional Mathematics',   1),
  (2,  'B', 'Art',                       2),
  (3,  'A', 'Biology',                   3),
  (4,  'B', 'Mathematics',              4),
  (5,  'A', 'Accounting',               5),
  (6,  'A', 'Additional Mathematics',   6),
  (7,  'A', 'Mathematics',              7),
  (8,  'A', 'Chemistry',                8),
  (9,  'B', 'Art',                       9),
  (10, 'B', 'Computer Science',         10),
  (11, 'B', 'Business Studies',         11),
  (12, 'A', 'Additional Mathematics',   12),
  (13, 'A', 'Chemistry',                3),
  (14, 'B', 'Physics',                  6)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 15. STUDENT PATHWAY (10 rows — students exploring pathways)
-- =====================
INSERT INTO student_pathway (id, created_date, student_profileid, pathwayid) VALUES
  (1,  '2026-04-20', 1,  1),
  (2,  '2026-04-21', 2,  4),
  (3,  '2026-04-22', 3,  6),
  (4,  '2026-04-22', 4,  3),
  (5,  '2026-04-23', 5,  4),
  (6,  '2026-04-23', 6,  1),
  (7,  '2026-04-24', 7,  7),
  (8,  '2026-04-24', 8,  3),
  (9,  '2026-04-25', 9,  9),
  (10, '2026-04-25', 10, 10)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 16. COUNSELOR ANALYTICS (10 rows)
-- =====================
INSERT INTO counselor_analytics (id, category, label, value) VALUES
  (1,  'RIASEC',     'Realistic',      28),
  (2,  'RIASEC',     'Investigative',  35),
  (3,  'RIASEC',     'Artistic',       18),
  (4,  'RIASEC',     'Social',         22),
  (5,  'RIASEC',     'Enterprising',   30),
  (6,  'RIASEC',     'Conventional',   25),
  (7,  'Top Fields', 'Computer Science', 42),
  (8,  'Top Fields', 'Medicine',       28),
  (9,  'Top Fields', 'Business',       35),
  (10, 'Top Fields', 'Engineering',    31)
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 17. COUNSELOR STUDENTS (10 rows)
-- =====================
INSERT INTO counselor_students (id, student_id, name, riasec_code, top_match, ai_risk, status) VALUES
  (1,  '1',  'Ali',        'ESC', 'Software Engineering', 'Low',    'Reviewed'),
  (2,  '4',  'Mei Ling',   'AIR', 'Graphic Design',      'Medium', 'Reviewed'),
  (3,  '5',  'Raj Kumar',  'RCI', 'Civil Engineering',    'Low',    'Pending'),
  (4,  '6',  'Sarah Tan',  'ISR', 'Data Science',         'Low',    'Reviewed'),
  (5,  '7',  'Ahmad',      'ECS', 'Business Analyst',     'Medium', 'Pending'),
  (6,  '8',  'Nurul Ain',  'SIA', 'Medicine',             'Low',    'Reviewed'),
  (7,  '9',  'Jason Lee',  'ARI', 'Architecture',         'High',   'Flagged'),
  (8,  '10', 'Priya',      'ICS', 'Pharmacy',             'Low',    'Pending'),
  (9,  '11', 'David Wong', 'ECR', 'Cybersecurity',        'Medium', 'Reviewed'),
  (10, '12', 'Farah',      'EIC', 'Accountant',           'Low',    'Pending')
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 18. API USAGE (singleton tracker)
-- =====================
INSERT INTO api_usage (id, count, last_updated) VALUES
  ('TOTAL_USAGE', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 19. SYSTEM LOG (10 rows of initial activity)
-- =====================
INSERT INTO system_log (id, timestamp, level, message) VALUES
  (1,  '2026-04-20 08:00:00', 'INFO',  'System started successfully.'),
  (2,  '2026-04-20 08:01:00', 'INFO',  'Database connection established to edupath_ai_db.'),
  (3,  '2026-04-20 08:05:00', 'INFO',  'New user registered successfully. Username: Ali, Role: STUDENT.'),
  (4,  '2026-04-20 08:06:00', 'INFO',  'New user registered successfully. Username: Sheila, Role: COUNSELOR.'),
  (5,  '2026-04-20 08:07:00', 'INFO',  'New user registered successfully. Username: Heng, Role: ADMIN.'),
  (6,  '2026-04-20 09:15:00', 'INFO',  'User Ali logged in successfully.'),
  (7,  '2026-04-20 09:30:00', 'INFO',  'AI Reality Report generated for student Ali.'),
  (8,  '2026-04-20 10:00:00', 'WARN',  'API usage approaching daily limit (80% consumed).'),
  (9,  '2026-04-21 08:00:00', 'INFO',  'Scheduled MQA data sync completed. 156 courses updated.'),
  (10, '2026-04-21 09:45:00', 'INFO',  'User Sheila logged in successfully.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RESET AUTO-INCREMENT SEQUENCES
-- Ensures next inserts get IDs after our seed data
-- ============================================================
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('student_profile', 'id'), COALESCE((SELECT MAX(id) FROM student_profile), 1));
SELECT setval(pg_get_serial_sequence('counselor_profile', 'id'), COALESCE((SELECT MAX(id) FROM counselor_profile), 1));
SELECT setval(pg_get_serial_sequence('admin_profile', 'adminid'), COALESCE((SELECT MAX(adminid) FROM admin_profile), 1));
SELECT setval(pg_get_serial_sequence('academic_assessment', 'academic_assessmentid'), COALESCE((SELECT MAX(academic_assessmentid) FROM academic_assessment), 1));
SELECT setval(pg_get_serial_sequence('personality_assessment', 'personality_assessmentid'), COALESCE((SELECT MAX(personality_assessmentid) FROM personality_assessment), 1));
SELECT setval(pg_get_serial_sequence('pathway', 'pathwayid'), COALESCE((SELECT MAX(pathwayid) FROM pathway), 1));
SELECT setval(pg_get_serial_sequence('student_pathway', 'id'), COALESCE((SELECT MAX(id) FROM student_pathway), 1));
SELECT setval(pg_get_serial_sequence('career', 'careerid'), COALESCE((SELECT MAX(careerid) FROM career), 1));
SELECT setval(pg_get_serial_sequence('career_pathway', 'id'), COALESCE((SELECT MAX(id) FROM career_pathway), 1));
SELECT setval(pg_get_serial_sequence('university', 'id'), COALESCE((SELECT MAX(id) FROM university), 1));
SELECT setval(pg_get_serial_sequence('university_pathway', 'id'), COALESCE((SELECT MAX(id) FROM university_pathway), 1));
SELECT setval(pg_get_serial_sequence('courses', 'id'), COALESCE((SELECT MAX(id) FROM courses), 1));
SELECT setval(pg_get_serial_sequence('subject', 'id'), COALESCE((SELECT MAX(id) FROM subject), 1));
SELECT setval(pg_get_serial_sequence('counselor_analytics', 'id'), COALESCE((SELECT MAX(id) FROM counselor_analytics), 1));
SELECT setval(pg_get_serial_sequence('counselor_students', 'id'), COALESCE((SELECT MAX(id) FROM counselor_students), 1));
SELECT setval(pg_get_serial_sequence('system_log', 'id'), COALESCE((SELECT MAX(id) FROM system_log), 1));

-- ============================================================
-- Academic Pipeline Fix (Set created_at for users)
-- ============================================================
UPDATE users SET created_at = '2026-01-15 10:00:00' WHERE id IN (1, 4);
UPDATE users SET created_at = '2026-02-10 10:00:00' WHERE id IN (5, 6);
UPDATE users SET created_at = '2026-03-20 10:00:00' WHERE id IN (7, 11);
UPDATE users SET created_at = '2026-04-12 10:00:00' WHERE id IN (8, 9);
UPDATE users SET created_at = '2026-05-05 10:00:00' WHERE id IN (10, 12);

INSERT INTO users (id, email, name, password, role, status, created_at) VALUES
  (14, 'dummy1@gmail.com', 'Dummy 1', '123456', 'STUDENT', 'ACTIVE', '2026-03-01 10:00:00'),
  (15, 'dummy2@gmail.com', 'Dummy 2', '123456', 'STUDENT', 'ACTIVE', '2026-04-01 10:00:00'),
  (16, 'dummy3@gmail.com', 'Dummy 3', '123456', 'STUDENT', 'ACTIVE', '2026-05-01 10:00:00')
ON CONFLICT (id) DO UPDATE SET created_at = EXCLUDED.created_at;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));