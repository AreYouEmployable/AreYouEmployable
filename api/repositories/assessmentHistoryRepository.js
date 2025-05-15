import pool from '../database.js';

export const getAssessmentHistoryRepository = async (googleId) => {
  try {
    const query = `
      SELECT
        a.assessment_id,
        a.score AS total_score,
        s.name AS status
      FROM assessments a
      JOIN assessment_status s ON a.assessment_status_id = s.assessment_status_id
      JOIN users u ON a.user_id = u.user_id
      WHERE u.google_id = $1
      ORDER BY a.assessment_id DESC;
    `;
    const result = await pool.query(query, [googleId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching assessment history from database:", error);
    throw error;
  }
};

export default getAssessmentHistoryRepository;