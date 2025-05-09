INSERT INTO question_type (question_type_id, name) VALUES
    (1, 'Technical'),
    (2, 'Communication'),
    (3, 'Problem Solving'),
    (4, 'Soft Skills');

INSERT INTO question_difficulty (question_difficulty_id, name) VALUES
    (1, 'Easy'),
    (2, 'Medium'),
    (3, 'Hard');

INSERT INTO assessment_status (assessment_status_id, name) VALUES
    (1, 'In Progress'),
    (2, 'Completed');

    -- Insert Scenario
INSERT INTO scenarios (scenario_id, title, description, type_id, difficulty_id)
VALUES (
    1,
    'Debugging Challenge',
    'You''ve been tasked with fixing a critical bug in production. How do you approach the situation?',
    1,  -- Technical
    2   -- Medium
);

-- Insert Questions
INSERT INTO questions (question_id, scenario_id, question_text, explanation) VALUES
    (1, 1, 'The production website is showing a blank page. What''s your first step?', 'When debugging production issues, collecting data through logs and trying to reproduce the problem are critical first steps.'),
    (2, 1, 'You found that a third-party API is down. How do you handle this?', NULL);

-- Insert Question Options for Question 1
INSERT INTO question_options (question_option_id, question_id, label, value, is_correct, answer_note) VALUES
    (1, 1, 'A', 'Immediately roll back to the previous version', false, 'While rollbacks are important, investigating first helps understand the issue.'),
    (2, 1, 'B', 'Check browser console and server logs', true, 'Excellent! Checking logs helps identify the root cause quickly.'),
    (3, 1, 'C', 'Ask another developer what changed', false, 'Communication is good, but diagnosis should start with technical investigation.'),
    (4, 1, 'D', 'Try to reproduce the issue locally', true, 'Good approach! Reproducing locally helps with debugging.');

-- Insert Question Options for Question 2
INSERT INTO question_options (question_option_id, question_id, label, value, is_correct, answer_note) VALUES
    (5, 2, 'A', 'Implement a fallback mechanism', true, 'Great! Fallbacks ensure your application remains functional.'),
    (6, 2, 'B', 'Wait for the API to come back online', false, 'Waiting creates extended downtime for your users.'),
    (7, 2, 'C', 'Add error messaging and graceful degradation', true, 'Excellent approach! Clear communication to users is important.'),
    (8, 2, 'D', 'Complain to the API provider', false, 'While feedback is important, solving the immediate issue comes first.');

-- Insert Scenario 2
INSERT INTO scenarios (scenario_id, title, description, type_id, difficulty_id)
VALUES (
    2,
    'Code Review Scenario',
    'You''re reviewing a colleague''s pull request. How do you provide constructive feedback?',
    2,  -- Communication
    2   -- Medium
);

-- Insert Question for Scenario 2
INSERT INTO questions (question_id, scenario_id, question_text, explanation) VALUES
    (3, 2, 'You notice inefficient code that works but could be improved. What do you do?', NULL);

-- Insert Question Options for Question 3
INSERT INTO question_options (question_option_id, question_id, label, value, is_correct, answer_note) VALUES
    (9, 3, 'A', 'Approve it since it works', false, 'Working code isnt always good code. Suggesting improvements helps everyone learn.'),
    (10, 3, 'B', 'Suggest improvements with explanations and examples', true, 'Perfect approach! Providing context and examples helps the developer learn.'),
    (11, 3, 'C', 'Reject the PR with comments about efficiency', false, 'Rejecting without constructive feedback can discourage collaboration.'),
    (12, 3, 'D', 'Fix it yourself and push to their branch', false, 'This doesnt help them learn, and modifying someone elses branch without permission isnt appropriate.');

-- -- Insert Scenario 3
-- INSERT INTO scenarios (scenario_id, title, description, type_id, difficulty_id)
-- VALUES (
--     3,
--     'System Design Challenge',
--     'You need to design a scalable application. How do you approach the architecture?',
--     3,  -- Problem Solving
--     3   -- Hard
-- );

-- -- Insert Question for Scenario 3
-- INSERT INTO questions (question_id, scenario_id, question_text) VALUES
--     (4, 3, 'What''s your first step when designing a new system?');

-- -- Insert Question Options for Question 4
-- INSERT INTO question_options (question_option_id, question_id, label, value) VALUES
--     (13, 4, 'A', 'Start coding immediately'),
--     (14, 4, 'B', 'Gather requirements and constraints'),
--     (15, 4, 'C', 'Choose the latest trending technologies'),
--     (16, 4, 'D', 'Create high-level diagrams of components');

-- -- Insert Scenario 4
-- INSERT INTO scenarios (scenario_id, title, description, type_id, difficulty_id)
-- VALUES (
--     4,
--     'Team Conflict Resolution',
--     'Your team has differing opinions on implementation approach. How do you reach consensus?',
--     4,  -- Soft Skills
--     2   -- Medium
-- );

-- -- Insert Question for Scenario 4
-- INSERT INTO questions (question_id, scenario_id, question_text) VALUES
--     (5, 4, 'Two senior developers disagree on architecture. How do you help resolve this?');

-- -- Insert Question Options for Question 5
-- INSERT INTO question_options (question_option_id, question_id, label, value) VALUES
--     (17, 5, 'A', 'Let the most experienced developer decide'),
--     (18, 5, 'B', 'Facilitate a discussion focusing on trade-offs and project needs'),
--     (19, 5, 'C', 'Implement both approaches and see which works better'),
--     (20, 5, 'D', 'Ask the manager to make the final decision');



INSERT INTO users (user_id, google_id, email, username, created_at)
VALUES (1, 'test_user', 'test@example.com', 'testuser', NOW());

INSERT INTO assessments (assessment_id, user_id, score, result_summary, assessment_status_id)
VALUES (1, 1, NULL, NULL, 1);

INSERT INTO assessment_scenarios (assessment_scenario_id, assessment_id, scenario_id, scenario_index)
VALUES 
    (1, 1, 1, 1),
    (2, 1, 2, 2);