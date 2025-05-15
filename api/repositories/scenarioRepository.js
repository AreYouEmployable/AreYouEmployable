import db from '../database.js';

/**
 * Retrieves detailed information about a specific scenario within an assessment,
 * including its title, description, type, difficulty, index, and associated questions.
 * Each question includes its text and available options.
 * 
 * @param {number} assessmentId - The ID of the assessment.
 * @param {number} scenarioId - The ID of the scenario.
 * @returns {Promise<object|null>} The scenario object with questions and options, or null if not found.
 */

export const getScenarioInfo = async (assessmentId, scenarioId) => {
    const result = await db.query(
        `
        SELECT 
            s.scenario_id,
            s.title AS scenario_title,
            s.description AS scenario_description,
            qt.name AS type,
            qd.name AS difficulty,
            ass_scenario.scenario_index,
            jsonb_agg(
                jsonb_build_object(
                    'question_id', q.question_id,
                    'question_text', q.question_text,
                    'options', options.options
                )
            ) AS questions
        FROM scenarios s
        JOIN question_type qt ON s.type_id = qt.question_type_id
        JOIN question_difficulty qd ON s.difficulty_id = qd.question_difficulty_id
        JOIN questions q ON q.scenario_id = s.scenario_id
        JOIN assessment_scenarios ass_scenario ON ass_scenario.scenario_id = s.scenario_id
        AND ass_scenario.assessment_id = $1
        LEFT JOIN (
            SELECT 
                qo.question_id,
                jsonb_agg(
                    jsonb_build_object(
                        'option_id', qo.question_option_id,
                        'label', qo.label,
                        'value', qo.value
                    )
                ) AS options
            FROM question_options qo
            GROUP BY qo.question_id
        ) options ON options.question_id = q.question_id
        WHERE s.scenario_id = $2
        GROUP BY s.scenario_id, qt.name, qd.name, ass_scenario.scenario_index
        `,
        [assessmentId, scenarioId]
    );

    return result.rows[0];
};

// scenarioRepository.js

/**
 * Fetches a specified number of random scenarios from the database.
 * @param {object} dbClient - The active database client.
 * @param {number} count - The number of random scenarios to fetch.
 * @returns {Promise<Array<object>>} An array of scenario objects (e.g., [{ scenario_id }, ...]).
 */
export async function findRandom(dbClient, count) {
    if (count <= 0) {
      return [];
    }
    const result = await dbClient.query(
      `SELECT scenario_id FROM scenarios ORDER BY RANDOM() LIMIT $1`,
      [count]
    );
    return result.rows;
  }