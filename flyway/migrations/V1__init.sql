-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) DEFAULT 'Software Engineer',
    picture VARCHAR(255) DEFAULT 'No picture link set',
    created_at TIMESTAMP DEFAULT now()
);

-- Assessment status lookup table
CREATE TABLE assessment_status (
    assessment_status_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Question type lookup table
CREATE TABLE question_type (
    question_type_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Question difficulty lookup table
CREATE TABLE question_difficulty (
    question_difficulty_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Scenarios table
CREATE TABLE scenarios (
    scenario_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    difficulty_id INT NOT NULL,
    CONSTRAINT fk_scenarios_type FOREIGN KEY (type_id) REFERENCES question_type(question_type_id),
    CONSTRAINT fk_scenarios_difficulty FOREIGN KEY (difficulty_id) REFERENCES question_difficulty(question_difficulty_id)
);

-- Assessments table
CREATE TABLE assessments (
    assessment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    score INT DEFAULT 0,
    result_summary VARCHAR(255) DEFAULT 'Summary not available',
    assessment_status_id INT NOT NULL,
    CONSTRAINT fk_assessments_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_assessments_status FOREIGN KEY (assessment_status_id) REFERENCES assessment_status(assessment_status_id)
);

-- Join table for assessments and scenarios
CREATE TABLE assessment_scenarios (
    assessment_scenario_id SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    scenario_id INT NOT NULL,
    scenario_index INT NOT NULL,
    CONSTRAINT fk_assessment_scenarios_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
    CONSTRAINT fk_assessment_scenarios_scenario FOREIGN KEY (scenario_id) REFERENCES scenarios(scenario_id)
);

-- Questions table
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    explanation VARCHAR(255) DEFAULT 'No explanation provided',
    CONSTRAINT fk_questions_scenario FOREIGN KEY (scenario_id) REFERENCES scenarios(scenario_id)
);

-- Question options
CREATE TABLE question_options (
    question_option_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    label VARCHAR(10) NOT NULL,
    value VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answer_note VARCHAR(255) NOT NULL,
    CONSTRAINT fk_question_options_question FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

-- User answers
CREATE TABLE user_answers (
    user_answer_id SERIAL PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT NOT NULL,
    CONSTRAINT fk_user_answer_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
    CONSTRAINT fk_user_answer_question FOREIGN KEY (question_id) REFERENCES questions(question_id),
    CONSTRAINT fk_user_answer_option FOREIGN KEY (option_id) REFERENCES question_options(question_option_id)
);
