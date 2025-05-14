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


/**
 * Finds all questions for a given list of scenario IDs.
 * @param {object} dbClient - The active database client.
 * @param {Array<number>} scenarioIds - An array of scenario IDs.
 * @returns {Promise<Array<object>>} An array of question objects.
 */
async function findByScenarioIds(dbClient, scenarioIds) {
    if (!scenarioIds || scenarioIds.length === 0) {
      return [];
    }
    const query = `
      SELECT
          question_id,
          scenario_id,
          question_text,
          explanation -- Be cautious about when to display this to the user
      FROM questions
      WHERE scenario_id = ANY($1::int[])
      ORDER BY question_id ASC; -- Or by a specific order within a scenario if available
    `;
    const result = await dbClient.query(query, [scenarioIds]);
    return result.rows;
  }


/**
 * Finds all questions for a single scenario ID.
 * @param {object} dbClient - The active database client.
 * @param {number} scenarioId - The ID of the scenario.
 * @returns {Promise<Array<object>>} An array of question objects.
 */
export async function findByScenarioId(dbClient, scenarioId) {
    if (!scenarioId) { // Ensure scenarioId is valid
      return [];
    }
    const query = `
      SELECT
          question_id,
          scenario_id,
          question_text,
          explanation
      FROM questions
      WHERE scenario_id = $1
      ORDER BY question_id ASC;
    `;
    const result = await dbClient.query(query, [scenarioId]);
    return result.rows;
  }

export { getQuestionById,findByScenarioIds };