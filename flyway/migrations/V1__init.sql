CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE scenarios (
    scenario_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE question_type (
    question_type_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE question_difficulty (
    question_difficulty_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(scenario_id),
    question_text TEXT,
    type_id INTEGER REFERENCES question_type(question_type_id),
    difficulty_id INTEGER REFERENCES question_difficulty(question_difficulty_id)
);

CREATE TABLE question_options (
    question_option_id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(question_id),
    label VARCHAR(10),
    value TEXT,
    is_correct BOOLEAN
);

CREATE TABLE assessment_status (
    assessment_status_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE assessments (
    assessment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    scenario_id INTEGER NOT NULL REFERENCES scenarios(scenario_id),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    score INTEGER,
    result_summary VARCHAR(255),
    assessment_status_id INTEGER REFERENCES assessment_status(assessment_status_id)
);

CREATE TABLE user_answer (
    user_answer_id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(assessment_id),
    question_id INTEGER NOT NULL REFERENCES questions(question_id),
    choice_id INTEGER REFERENCES question_options(question_option_id),
    text_answer TEXT,
    created_at TIMESTAMP DEFAULT now()
);
