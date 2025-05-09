import db from '../database.js';

const getQuestionById = async (questionId) => {
    const result = await db.query(
        `
        SELECT 
            q.question_id,
            q.question_text,
            qt.name AS question_type,
            qd.name AS question_difficulty,
            s.scenario_id,
            s.title AS scenario_title,
            s.description AS scenario_description,
            json_agg(json_build_object(
                'question_option_id', qo.question_option_id,
                'label', qo.label,
                'value', qo.value
            )) AS options
        FROM questions q
        JOIN scenarios s ON q.scenario_id = s.scenario_id
        LEFT JOIN question_type qt ON q.type_id = qt.question_type_id
        LEFT JOIN question_difficulty qd ON q.difficulty_id = qd.question_difficulty_id
        LEFT JOIN question_options qo ON q.question_id = qo.question_id
        WHERE q.question_id = $1
        GROUP BY q.question_id, qt.name, qd.name, s.scenario_id, s.title, s.description
        `,
        [questionId]
    );

    return result.rows[0];
};

export { getQuestionById };