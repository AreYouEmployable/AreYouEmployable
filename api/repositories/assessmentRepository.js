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

export { createAssessment, getAssessmentById, completeAssessment };