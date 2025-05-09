import db from '../database.js';

const createAssessment = async ({ userId, scenarioId, assessmentStatusId }) => {
    const result = await db.query(
        `
        INSERT INTO assessments (user_id, scenario_id, started_at, assessment_status_id)
        VALUES ($1, $2, NOW(), $3)
        RETURNING *
        `,
        [userId, scenarioId, assessmentStatusId]
    );

    return result.rows[0];
};

const getAssessmentById = async (assessmentId) => {
    const result = await db.query(
        `
        SELECT *
        FROM assessments
        WHERE assessment_id = $1
        `,
        [assessmentId]
    );

    return result.rows[0];
};

const completeAssessment = async ({ assessmentId, score, resultSummary }) => {
    const result = await db.query(
        `
        UPDATE assessments
        SET completed_at = NOW(),
            score = $2,
            result_summary = $3,
            assessment_status_id = 2
        WHERE assessment_id = $1
        RETURNING *
        `,
        [assessmentId, score, resultSummary]
    );
    
    return result.rows[0];
};


const getUserAnswersWithCorrectness = async (assessmentId) => {
  const { rows } = await db.query(`
    SELECT 
        ua.question_id,
        qt.name AS question_type,
        qo.is_correct
    FROM user_answer ua
    JOIN questions q ON ua.question_id = q.question_id
    LEFT JOIN question_type qt ON q.type_id = qt.question_type_id
    LEFT JOIN question_options qo ON ua.choice_id = qo.question_option_id
    WHERE ua.assessment_id = $1
  `, [assessmentId]);


  return rows;
};

const updateAssessmentResult = async (assessmentId, score, resultSummary) => {
  await db.query(`
    UPDATE assessments
    SET score = $1,
        result_summary = $2,
        completed_at = NOW(),
        assessment_status_id = (
            SELECT assessment_status_id FROM assessment_status WHERE name = 'Completed'
        )
    WHERE assessment_id = $3
  `, [score, resultSummary, assessmentId]);
};

export { createAssessment, getAssessmentById, completeAssessment, getUserAnswersWithCorrectness, updateAssessmentResult};