import db from '../database.js';

const createUserAnswer = async ({ assessmentId, questionId, optionId }) => {
    const result = await db.query(
        `
        INSERT INTO user_answers (assessment_id, question_id, option_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [assessmentId, questionId, optionId]
    );

    return result.rows[0];
};

const getUserAnswer = async ({ answerId }) => {
    const result = await db.query(
        `
        SELECT ua.assessment_id, ua.question_id, ua.option_id, qo.is_correct
        FROM user_answers ua
        JOIN question_options qo ON ua.option_id = qo.question_option_id
        WHERE ua.user_answer_id = $1
        `,
        [answerId]
    );

    if (result.rows.length === 0) {
        return null;
    };

    return result.rows[0];
};

const getAssessmentUserAnswers = async ({ assessmentId, userId }) => {
    const result = await db.query(
        `
        SELECT 
            ua.user_answer_id,
            ua.assessment_id,
            ua.question_id,
            ua.option_id,
            qo.is_correct
        FROM user_answers ua
        JOIN question_options qo ON ua.option_id = qo.question_option_id
        JOIN assessments a ON ua.assessment_id = a.assessment_id
        WHERE ua.assessment_id = $1 AND a.user_id = $2
        `,
        [assessmentId, userId]
    );

    return result.rows;
};

export { createUserAnswer, getUserAnswer, getAssessmentUserAnswers };