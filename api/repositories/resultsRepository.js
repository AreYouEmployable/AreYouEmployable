import pool from '../database.js';

const getAssessmentResultsRepository = async (assessmentId) => {
    const query = `
    SELECT
      a.assessment_id,
      a.score AS total_score,
      qt.name AS category,
      COUNT(DISTINCT q.question_id) AS total_questions,
      COUNT(DISTINCT CASE WHEN qo.is_correct THEN q.question_id END) AS correct_answers
    FROM assessments a
    JOIN users u ON a.user_id = u.user_id
    JOIN assessment_status s ON a.assessment_status_id = s.assessment_status_id
    JOIN assessment_scenarios assc ON a.assessment_id = assc.assessment_id
    JOIN scenarios sc ON assc.scenario_id = sc.scenario_id
    JOIN question_type qt ON sc.type_id = qt.question_type_id
    JOIN questions q ON sc.scenario_id = q.scenario_id
    JOIN user_answers ua ON a.assessment_id = ua.assessment_id AND q.question_id = ua.question_id
    JOIN question_options qo ON ua.option_id = qo.question_option_id
    WHERE a.assessment_id = $1
    GROUP BY
      a.assessment_id,
      a.score,
      s.name,
      qt.name
    ORDER BY a.assessment_id, qt.name;
  `;

    try {
        const result = await pool.query(query, [assessmentId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching assessment results from database:', error);
        throw error;
    }
};

export default getAssessmentResultsRepository;