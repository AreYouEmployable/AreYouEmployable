CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkedin_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE scenarios (
    scenario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    description TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE question_type (
    question_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255)
);

CREATE TABLE question_difficulty (
    question_difficulty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255)
);

CREATE TABLE questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES scenarios(scenario_id),
    question_text TEXT,
    type_id UUID REFERENCES question_type(question_type_id),
    difficulty_id UUID REFERENCES question_difficulty(question_difficulty_id)
);

CREATE TABLE question_options (
    question_option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id),
    label VARCHAR(10),
    value TEXT,
    is_correct BOOLEAN
);

CREATE TABLE assessment_status (
    assessment_status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255)
);

CREATE TABLE assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    scenario_id UUID NOT NULL REFERENCES scenarios(scenario_id),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    score INTEGER,
    result_summary VARCHAR(255),
    assessment_status_id UUID REFERENCES assessment_status(assessment_status_id)
);

CREATE TABLE user_answer (
    user_answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(assessment_id),
    question_id UUID NOT NULL REFERENCES questions(question_id),
    choice_id UUID REFERENCES question_options(question_option_id),
    text_answer TEXT,
    created_at TIMESTAMP DEFAULT now()
);
