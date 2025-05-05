import db from '../database.js'

// TODO NOT PROPERLY implemented yet
// export async function createAssessmentForUser(userId, assessmentData) {
//     const { title, description } = assessmentData;

//     const result = await db.query(
//         `INSERT INTO assessments (user_id, title, description, created_at, completed)
//         VALUES ($1, $2, $3, NOW(), false)
//         RETURNING *`,
//         [userId, title, description]
//     );

//     return result.rows[0];
// };

export async function getAssessmentById(userId, assessmentId) {
    const result = await db.query(
        `
        SELECT 
            a.*, 
            s.name AS status_name
        FROM assessments a
        LEFT JOIN assessment_status s ON a.assessment_status_id = s.assessment_status_id
        WHERE a.assessment_id = $1 AND a.user_id = $2
        `,
        [assessmentId, userId]
    );
    return result.rows[0] || null;
};

// TODO NOT PROPERLY implemented yet
// export async function getAllAssessmentsForUser(userId) {
//     const result = await db.query(
//         `SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC`,
//         [userId]
//     );
//     return result.rows;
// };
