import db from '../database.js';

export const createUserAnswer = async ({ assessmentId, questionId, optionId }, client) => {
    const result = await client.query(
        `
        INSERT INTO user_answers (assessment_id, question_id, option_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [assessmentId, questionId, optionId]
    );
    return result.rows[0];
};

export const getUserAnswerDetails = async ({ assessmentId, questionId }, client) => {
    const result = await client.query(
        `
        SELECT 
            q.explanation,
            qo.is_correct,
            qo.answer_note
        FROM user_answers ua
        JOIN questions q ON ua.question_id = q.question_id
        JOIN question_options qo ON ua.option_id = qo.question_option_id
        WHERE ua.assessment_id = $1 AND ua.question_id = $2
        `,
        [assessmentId, questionId]
    );
    return result.rows[0];
};

// // BELOW MAY BE OUTDATED
// const getUserAnswer = async ({ answerId }) => {
//     const result = await db.query(
//         `
//         SELECT ua.assessment_id, ua.question_id, ua.option_id, qo.is_correct
//         FROM user_answers ua
//         JOIN question_options qo ON ua.option_id = qo.question_option_id
//         WHERE ua.user_answer_id = $1
//         `,
//         [answerId]
//     );

//     if (result.rows.length === 0) {
//         return null;
//     };

//     return result.rows[0];
// };

// // BELOW MAY BE OUTDATED
// const getAssessmentUserAnswers = async ({ assessmentId, userId }) => {
//     const result = await db.query(
//         `
//         SELECT 
//             ua.user_answer_id,
//             ua.assessment_id,
//             ua.question_id,
//             ua.option_id,
//             qo.is_correct
//         FROM user_answers ua
//         JOIN question_options qo ON ua.option_id = qo.question_option_id
//         JOIN assessments a ON ua.assessment_id = a.assessment_id
//         WHERE ua.assessment_id = $1 AND a.user_id = $2
//         `,
//         [assessmentId, userId]
//     );

//     return result.rows;
// };

// export { createUserAnswer, getUserAnswer, getAssessmentUserAnswers };

export const getAssessmentUserAnswers = async (assessmentId) => {
    const result = await db.query(
        `
        SELECT 
            q.question_text,
            qo.is_correct
        FROM user_answers ua
        JOIN questions q ON ua.question_id = q.question_id
        JOIN question_options qo ON ua.option_id = qo.question_option_id
        WHERE ua.assessment_id = $1;
        `,
        [assessmentId]
    );
    return result.rows;
};