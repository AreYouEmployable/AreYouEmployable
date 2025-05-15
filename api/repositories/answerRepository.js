import db from '../database.js';

 const createUserAnswer = async ({ assessmentId, questionId, optionId }, client) => {
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

 const getUserAnswerDetails = async ({ assessmentId, questionId }, client) => {
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

/**
 * Finds all options for a given list of question IDs.
 * IMPORTANT: This version omits 'is_correct' and 'answer_note' for active assessments.
 * @param {object} dbClient - The active database client.
 * @param {Array<number>} questionIds - An array of question IDs.
 * @returns {Promise<Array<object>>} An array of question option objects.
 */
 async function findByQuestionIdsForAssessment(dbClient, questionIds) {
    if (!questionIds || questionIds.length === 0) {
      return [];
    }
    const query = `
      SELECT
          question_option_id,
          question_id,
          label,
          value
          -- Excluded for active assessment: is_correct, answer_note
      FROM question_options
      WHERE question_id = ANY($1::int[])
      ORDER BY question_id ASC, label ASC; -- Ensure consistent option order
    `;
    const result = await dbClient.query(query, [questionIds]);
    return result.rows;
  }

/**
 * Stores a user's answer for a question in an assessment.
 * @param {object} dbClient - The active database client.
 * @param {object} answerData - The answer data.
 * @param {number} answerData.assessment_id - The assessment ID.
 * @param {number} answerData.question_id - The question ID.
 * @param {number} answerData.selected_option_id - The selected option ID.
 * @param {number} answerData.user_id - The user ID.
 * @returns {Promise<object>} The stored answer with correctness information.
 */
 async function storeUserAnswer(dbClient, { assessment_id, question_id, selected_option_id, user_id }) {
    const existingAnswer = await dbClient.query(
        `SELECT user_answer_id FROM user_answers 
         WHERE assessment_id = $1 AND question_id = $2`,
        [assessment_id, question_id]
    );

    let result;
    if (existingAnswer.rows.length > 0) {
        result = await dbClient.query(
            `UPDATE user_answers 
             SET option_id = $3
             WHERE assessment_id = $1 AND question_id = $2
             RETURNING *`,
            [assessment_id, question_id, selected_option_id]
        );
    } else {
        result = await dbClient.query(
            `INSERT INTO user_answers (assessment_id, question_id, option_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [assessment_id, question_id, selected_option_id]
        );
    }

    const correctnessResult = await dbClient.query(
        `SELECT qo.is_correct
         FROM question_options qo
         WHERE qo.question_option_id = $1`,
        [selected_option_id]
    );

    return {
        ...result.rows[0],
        is_correct: correctnessResult.rows[0]?.is_correct || false
    };
}

/**
 * Gets all answers for a specific assessment
 * @param {object} dbClient - The active database client
 * @param {number} assessmentId - The ID of the assessment
 * @returns {Promise<Array<object>>} Array of answer objects
 */
async function findByAssessmentId(dbClient, assessmentId) {
    const query = `
        SELECT 
            ua.question_id,
            ua.option_id as selected_option_id
        FROM user_answers ua
        WHERE ua.assessment_id = $1
    `;
    const result = await dbClient.query(query, [assessmentId]);
    return result.rows;
}

export { 
    createUserAnswer, 
    getUserAnswerDetails, 
    findByQuestionIdsForAssessment, 
    storeUserAnswer,
    findByAssessmentId 
};

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