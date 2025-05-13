import db from '../database.js';

export const getScenarioInfo = async (assessmentId, scenarioId) => {
    const result = await db.query(
        `
        SELECT 
            s.scenario_id,
            s.title AS scenario_title,
            s.description AS scenario_description,
            qt.name AS type,
            qd.name AS difficulty,
            ass_scenario.scenario_index,
            jsonb_agg(
                jsonb_build_object(
                    'question_id', q.question_id,
                    'question_text', q.question_text,
                    'options', options.options
                )
            ) AS questions
        FROM scenarios s
        JOIN question_type qt ON s.type_id = qt.question_type_id
        JOIN question_difficulty qd ON s.difficulty_id = qd.question_difficulty_id
        JOIN questions q ON q.scenario_id = s.scenario_id
        JOIN assessment_scenarios ass_scenario ON ass_scenario.scenario_id = s.scenario_id
        AND ass_scenario.assessment_id = $1
        LEFT JOIN (
            SELECT 
                qo.question_id,
                jsonb_agg(
                    jsonb_build_object(
                        'option_id', qo.question_option_id,
                        'label', qo.label,
                        'value', qo.value
                    )
                ) AS options
            FROM question_options qo
            GROUP BY qo.question_id
        ) options ON options.question_id = q.question_id
        WHERE s.scenario_id = $2
        GROUP BY s.scenario_id, qt.name, qd.name, ass_scenario.scenario_index
        `,
        [assessmentId, scenarioId]
    );

    return result.rows[0];
};

export const getAssessmentOwnership = async (assessmentId, scenarioId) => {
    const result = await db.query(
        `
        SELECT ass.assessment_id, ass.user_id, ass_scenario.scenario_index
        FROM assessments ass
        JOIN assessment_scenarios ass_scenario ON ass.assessment_id = ass_scenario.assessment_id
        WHERE ass.assessment_id = $1 AND ass_scenario.scenario_id = $2
        `,
        [assessmentId, scenarioId]
    );

    return result.rows[0];
};

export const getUnansweredQuestions = async (assessmentId, currentIndex) => {
    const result = await db.query(
        `
        SELECT q.question_id
        FROM assessment_scenarios ass_s
        JOIN questions q ON q.scenario_id = ass_s.scenario_id
        LEFT JOIN user_answers ua ON ua.question_id = q.question_id AND ua.assessment_id = $1
        WHERE ass_s.assessment_id = $1
          AND ass_s.scenario_index < $2
          AND ua.user_answer_id IS NULL
        `,
        [assessmentId, currentIndex]
    );

    return result.rows[0];
};
