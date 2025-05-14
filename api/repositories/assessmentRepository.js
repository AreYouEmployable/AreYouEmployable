import db from '../database.js';

// assessmentRepository.js
// Assume 'db' or a similar utility is used for actual query execution if not directly using client.query
// For these examples, we'll assume dbClient is an active PostgreSQL client (e.g., from pool.connect())

/**
 * Inserts a new assessment record.
 * @param {object} dbClient - The active database client.
 * @param {object} assessmentData - Data for the new assessment.
 * @param {number|string} assessmentData.userId - The user's ID.
 * @param {number} assessmentData.assessmentStatusId - The initial status ID.
 * @returns {Promise<object>} The newly created assessment record (e.g., { assessment_id }).
 */
async function createAssessment(dbClient, { userId, assessmentStatusId }) {
    const result = await dbClient.query(
        `INSERT INTO assessments (user_id, score, result_summary, assessment_status_id)
         VALUES ((select user_id from users where google_id = $1), 0, '', $2)
         RETURNING assessment_id, user_id, assessment_status_id`,
        [userId, assessmentStatusId] // $1 is userId (interpreted as google_id), $2 is assessmentStatusId
      );
      return result.rows[0];
  }
  
  /**
   * Links multiple scenarios to an assessment in a batch.
   * @param {object} dbClient - The active database client.
   * @param {number} assessmentId - The ID of the assessment.
   * @param {Array<object>} scenarios - An array of scenario objects, each with a 'scenario_id'.
   * @returns {Promise<void>}
   */
  export async function linkScenariosBatch(dbClient, assessmentId, scenarios) {
    // Ensure scenarios is an array and not empty
    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      return; // Or throw an error if scenarios are mandatory
    }
  
    const insertPromises = scenarios.map((scenario, index) => {
      return dbClient.query(
        `INSERT INTO assessment_scenarios (assessment_id, scenario_id, scenario_index)
         VALUES ($1, $2, $3)`,
        [assessmentId, scenario.scenario_id, index + 1] // 1-based index
      );
    });
    await Promise.all(insertPromises);
  }
  
  // ... other assessment repository functions like getById, update, etc.
  // e.g., export async function getById(dbClient, assessmentId) { ... }

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

/**
 * Finds a basic assessment record by its ID, including the status name.
 * @param {object} dbClient - The active database client.
 * @param {number} assessmentId - The ID of the assessment.
 * @returns {Promise<object|null>} The assessment object or null if not found.
 */
export async function findById(dbClient, assessmentId) {
    const query = `
      SELECT
          a.assessment_id,
          a.user_id,
          a.score,
          a.result_summary,
          a.assessment_status_id,
          s.name AS assessment_status_name
          -- If you've added created_at, started_at, completed_at to your assessments table, select them here
      FROM assessments a
      JOIN assessment_status s ON a.assessment_status_id = s.assessment_status_id
      WHERE a.assessment_id = $1;
    `;
    const result = await dbClient.query(query, [assessmentId]);
    return result.rows[0] || null;
  }
  
  /**
   * Finds all scenarios linked to a given assessment, including their details and order.
   * @param {object} dbClient - The active database client.
   * @param {number} assessmentId - The ID of the assessment.
   * @returns {Promise<Array<object>>} An array of scenario objects.
   */
  export async function findScenariosByAssessmentId(dbClient, assessmentId) {
    const query = `
      SELECT
          sc.scenario_id,
          sc.title AS scenario_title,
          sc.description AS scenario_description,
          qt.name AS scenario_type_name,
          qd.name AS scenario_difficulty_name,
          ascen.scenario_index
      FROM assessment_scenarios ascen
      JOIN scenarios sc ON ascen.scenario_id = sc.scenario_id
      JOIN question_type qt ON sc.type_id = qt.question_type_id
      JOIN question_difficulty qd ON sc.difficulty_id = qd.question_difficulty_id
      WHERE ascen.assessment_id = $1
      ORDER BY ascen.scenario_index ASC;
    `;
    const result = await dbClient.query(query, [assessmentId]);
    return result.rows;
  }
  /**
 * Finds details for a specific scenario within an assessment by its index.
 * @param {object} dbClient - The active database client.
 * @param {number} assessmentId - The ID of the assessment.
 * @param {number} scenarioIndex - The 1-based index of the scenario within the assessment.
 * @returns {Promise<object|null>} Scenario details object or null if not found.
 */
export async function findScenarioDetailsByIndex(dbClient, assessmentId, scenarioIndex) {
    const query = `
      SELECT
          sc.scenario_id,
          sc.title AS scenario_title,
          sc.description AS scenario_description,
          qt.name AS scenario_type_name,
          qd.name AS scenario_difficulty_name,
          ascen.scenario_index  -- The actual index from the DB
      FROM assessment_scenarios ascen
      JOIN scenarios sc ON ascen.scenario_id = sc.scenario_id
      JOIN question_type qt ON sc.type_id = qt.question_type_id
      JOIN question_difficulty qd ON sc.difficulty_id = qd.question_difficulty_id
      WHERE ascen.assessment_id = $1 AND ascen.scenario_index = $2;
    `;
    const result = await dbClient.query(query, [assessmentId, scenarioIndex]);
    return result.rows[0] || null;
  }
  
  /**
   * Gets the total number of scenarios (or max index) for an assessment.
   * Useful for knowing when the assessment ends.
   * @param {object} dbClient - The active database client.
   * @param {number} assessmentId - The ID of the assessment.
   * @returns {Promise<number>} The maximum scenario index, or 0 if no scenarios.
   */
  export async function getMaxScenarioIndex(dbClient, assessmentId) {
      const query = `SELECT MAX(scenario_index) as max_index FROM assessment_scenarios WHERE assessment_id = $1;`;
      const result = await dbClient.query(query, [assessmentId]);
      return result.rows[0]?.max_index || 0;
  }

/**
 * Gets the total number of scenarios for an assessment.
 * @param {object} dbClient - The active database client.
 * @param {number} assessmentId - The ID of the assessment.
 * @returns {Promise<number>} The total number of scenarios.
 */
export async function getTotalScenarios(dbClient, assessmentId) {
    const query = `
        SELECT COUNT(*) as total
        FROM assessment_scenarios
        WHERE assessment_id = $1;
    `;
    const result = await dbClient.query(query, [assessmentId]);
    return parseInt(result.rows[0].total, 10);
}

/**
 * Gets the number of completed scenarios for an assessment.
 * A scenario is considered complete when all its questions have been answered.
 * @param {object} dbClient - The active database client.
 * @param {number} assessmentId - The ID of the assessment.
 * @returns {Promise<number>} The number of completed scenarios.
 */
 async function getCompletedScenarios(dbClient, assessmentId) {
    const query = `
        WITH scenario_questions AS (
            SELECT 
                as2.scenario_id,
                COUNT(q.question_id) as total_questions
            FROM assessment_scenarios as2
            JOIN scenarios s ON as2.scenario_id = s.scenario_id
            JOIN questions q ON s.scenario_id = q.scenario_id
            WHERE as2.assessment_id = $1
            GROUP BY as2.scenario_id
        ),
        answered_questions AS (
            SELECT 
                as2.scenario_id,
                COUNT(DISTINCT ua.question_id) as answered_questions
            FROM assessment_scenarios as2
            JOIN scenarios s ON as2.scenario_id = s.scenario_id
            JOIN questions q ON s.scenario_id = q.scenario_id
            JOIN user_answers ua ON q.question_id = ua.question_id
            WHERE as2.assessment_id = $1
            GROUP BY as2.scenario_id
        )
        SELECT COUNT(*) as completed
        FROM scenario_questions sq
        JOIN answered_questions aq ON sq.scenario_id = aq.scenario_id
        WHERE sq.total_questions = aq.answered_questions;
    `;
    const result = await dbClient.query(query, [assessmentId]);
    return parseInt(result.rows[0].completed, 10);
}

export { createAssessment, getAssessmentById, completeAssessment, getUserAnswersWithCorrectness, updateAssessmentResult,getCompletedScenarios};