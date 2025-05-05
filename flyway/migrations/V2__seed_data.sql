-- V2__seed_data.sql

-- USERS
INSERT INTO users (user_id, linkedin_id, email, username)
VALUES
    (1, 'linkedin_001', 'alice@example.com', 'alice'),
    (2, 'linkedin_002', 'bob@example.com', 'bob');

-- SCENARIOS
INSERT INTO scenarios (scenario_id, title, description, is_active)
VALUES
    (1, 'Cybersecurity Breach', 'Handle a mid-size company breach', true),
    (2, 'Cloud Migration', 'Plan a secure cloud infrastructure migration', true);

-- QUESTION TYPE
INSERT INTO question_type (question_type_id, name)
VALUES
    (1, 'Multiple Choice'),
    (2, 'Text Answer');

-- QUESTION DIFFICULTY
INSERT INTO question_difficulty (question_difficulty_id, name)
VALUES
    (1, 'Easy'),
    (2, 'Medium'),
    (3, 'Hard');

-- QUESTIONS
INSERT INTO questions (question_id, scenario_id, question_text, type_id, difficulty_id)
VALUES
    (1, 1, 'What is the first step after detecting a data breach?', 1, 1),
    (2, 1, 'Explain your approach to incident response.', 2, 2),
    (3, 2, 'Which AWS service helps with scalable storage?', 1, 1);

-- QUESTION OPTIONS
INSERT INTO question_options (question_option_id, question_id, label, value, is_correct)
VALUES
    (1, 1, 'A', 'Notify stakeholders', false),
    (2, 1, 'B', 'Contain the breach', true),
    (3, 1, 'C', 'Inform the press', false),
    (4, 3, 'A', 'S3', true),
    (5, 3, 'B', 'Lambda', false),
    (6, 3, 'C', 'EC2', false);

-- ASSESSMENT STATUS
INSERT INTO assessment_status (assessment_status_id, name)
VALUES
    (1, 'In Progress'),
    (2, 'Completed');

-- ASSESSMENTS
INSERT INTO assessments (
    assessment_id, user_id, scenario_id, started_at, completed_at, score, result_summary, assessment_status_id
) VALUES
    (1, 1, 1, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours', 80, 'Strong performance', 2),
    (2, 2, 2, NOW() - INTERVAL '2 hours', NULL, NULL, NULL, 1);

-- USER ANSWERS
INSERT INTO user_answer (user_answer_id, assessment_id, question_id, choice_id, text_answer)
VALUES
    (1, 1, 1, 2, NULL), -- Chose correct option for question 1
    (2, 1, 2, NULL, 'I would isolate affected systems and start investigation immediately'),
    (3, 2, 3, 4, NULL); -- Answered correctly for question 3
