import pool from '../database.js';// Your database connection pool
import * as assessmentRepository from '../repositories/assessmentRepository.js';
import * as scenarioRepository from '../repositories/scenarioRepository.js'; // Or import from assessmentRepository if combined
import * as answerRepository from '../repositories/answerRepository.js';
import * as questionRepository from '../repositories/questionRepository.js';

/**
 * Fetches a specific assessment for a user
 * @param {number} userId - The ID of the user
 * @param {number} assessmentId - The ID of the assessment
 * @returns {object|null} The assessment if found, or null
 * @throws {Error} If assessment is not found or another error occurs
 */
export async function getAssessment(userId, assessmentId) {
    return getScenarioForDisplay(assessmentId, 1)
}

export const submitAssessment = async (assessmentId, answers) => {
    // Process the submitted answers
    const processedAnswers = answers.map((scenarioAnswer, scenarioIndex) => {
        const scenario = ALL_SCENARIOS[scenarioIndex];
        return scenario.questions.map((question, questionIndex) => {
            const selectedOptions = scenarioAnswer.find(a => a.questionIndex === questionIndex)?.selectedOptions || [];
            const selectedOption = selectedOptions[0]; // Get the first selected option
            
            // Update the question in the mock data
            question.answered = true;
            question.selected_option = selectedOption;

            // Determine if the answer is correct (mock logic - you can implement your own scoring)
            const isCorrect = selectedOption === question.correct_option_id;

            return {
                question_id: question.question_id,
                selected_option: selectedOption,
                is_correct: isCorrect
            };
        });
    }).flat();

    // Calculate scores
    const totalScore = processedAnswers.filter(answer => answer.is_correct).length;
    const typeScores = {};
    
    // Group scores by scenario type
    ALL_SCENARIOS.forEach((scenario, index) => {
        const scenarioAnswers = processedAnswers.filter(answer => 
            scenario.questions.some(q => q.question_id === answer.question_id)
        );
        const scenarioScore = scenarioAnswers.filter(answer => answer.is_correct).length;
        typeScores[scenario.type] = (typeScores[scenario.type] || 0) + scenarioScore;
    });

    // Return the assessment results
    return {
        totalScore,
        typeScores,
        resultSummary: `Total: ${totalScore} (${Object.entries(typeScores)
            .map(([type, score]) => `${type}: ${score}`)
            .join(', ')})`,
        answers: processedAnswers
    };
};

export const submitScenario = async (assessmentId, scenarioIndex, answers) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Validate the assessment and scenario
        const scenarioDetails = await assessmentRepository.findScenarioDetailsByIndex(client, assessmentId, scenarioIndex);
        if (!scenarioDetails) {
            throw new Error(`Scenario at index ${scenarioIndex} not found for assessment ${assessmentId}`);
        }

        // 2. Get questions for this scenario to validate answers
        const questions = await questionRepository.findByScenarioId(client, scenarioDetails.scenario_id);
        if (!questions || questions.length === 0) {
            throw new Error('No questions found for this scenario');
        }

        // 3. Validate answers match questions
        if (answers.length !== questions.length) {
            throw new Error(`Expected ${questions.length} answers, got ${answers.length}`);
        }

        // 4. Process and store each answer
        const processedAnswers = [];
        for (const answer of answers) {
            const question = questions.find(q => q.question_id === answer.question_id);
            if (!question) {
                throw new Error(`Question ID ${answer.question_id} not found in this scenario`);
            }

            // Store the answer in the database
            const storedAnswer = await answerRepository.storeUserAnswer(client, {
                assessment_id: assessmentId,
                question_id: answer.question_id,
                selected_option_id: answer.selected_option_id,
                user_id: scenarioDetails.user_id // Assuming this comes from the scenario details
            });

            processedAnswers.push({
                question_id: answer.question_id,
                selected_option_id: answer.selected_option_id,
                is_correct: storedAnswer.is_correct // This would come from the database
            });
        }

        // 5. Calculate scores
        const correctAnswers = processedAnswers.filter(a => a.is_correct).length;
        const totalQuestions = questions.length;
        const scorePercentage = (correctAnswers / totalQuestions) * 100;

        // 6. Get total scenarios and completed scenarios
        const totalScenarios = await assessmentRepository.getTotalScenarios(client, assessmentId);
        const completedScenarios = await assessmentRepository.getCompletedScenarios(client, assessmentId);

        // 7. Check if this was the last scenario
        const isComplete = completedScenarios === totalScenarios;

        await client.query('COMMIT');

        return {
            success: true,
            scenarioScore: correctAnswers,
            scorePercentage,
            totalQuestions,
            answers: processedAnswers,
            isComplete,
            currentScenario: scenarioIndex,
            totalScenarios,
            completedScenarios,
            progress: (completedScenarios / totalScenarios) * 100
        };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in submitScenario:', error);
        throw error;
    } finally {
        client.release();
    }
};


/**
 * Creates a new assessment for a user, assigning a specified number of random scenarios.
 * Manages the entire transaction.
 *
 * @param {number|string} userId - The ID of the user.
 * @param {number} [numberOfScenarios=4] - The number of random scenarios to assign.
 * @param {number} [initialStatusId=1] - The ID for the initial assessment status (e.g., 'Not Started').
 * @returns {Promise<object>} An object containing the assessmentId and a success message.
 * @throws {Error} Throws an error if the creation process fails (e.g., no scenarios found).
 */
export async function createAssessmentWithRandomScenarios(userId, numberOfScenarios = 4, initialStatusId = 1) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Create new assessment record using the repository
    const newAssessment = await assessmentRepository.createAssessment(client, {
      userId,
      assessmentStatusId: initialStatusId,
    });
    const assessmentId = newAssessment.assessment_id;

    // Step 2: Pick random scenarios using the repository
    const scenarios = await scenarioRepository.findRandom(client, numberOfScenarios);

    if (scenarios.length === 0 && numberOfScenarios > 0) {
      // Or if scenarios.length < numberOfScenarios and that's a critical issue for your use case
      throw new Error(`No scenarios found to assign. Requested ${numberOfScenarios}, found ${scenarios.length}.`);
    }

    // Step 3: Insert into assessment_scenarios using the repository
    if (scenarios.length > 0) {
      await assessmentRepository.linkScenariosBatch(client, assessmentId, scenarios);
    }

    await client.query('COMMIT');
    return {
      assessmentId,
      message: `Assessment created successfully with ${scenarios.length} scenarios.`,
      // You might want to return more details about the assessment or scenarios if needed
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in AssessmentService creating assessment with scenarios:', error);
    // Re-throw the error for the controller/caller to handle
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Retrieves a specific scenario by its index for a given assessment,
 * including its questions and options.
 * Omits sensitive information like correct answers for active assessments.
 * @param {number} assessmentId - The ID of the assessment.
 * @param {number} scenarioIndex - The 1-based index of the scenario to retrieve.
 * @returns {Promise<object|null>} The structured scenario object, or null if not found.
 */
export async function getScenarioForDisplay(assessmentId, scenarioIndex) {
  const client = await pool.connect();
  try {
    const scenarioDetails = await assessmentRepository.findScenarioDetailsByIndex(client, assessmentId, scenarioIndex);

    if (!scenarioDetails) {
      return null;
    }

    // Get total number of scenarios for this assessment
    const totalScenarios = await assessmentRepository.getTotalScenarios(client, assessmentId);

    // Get all questions for this scenario
    const questions = await questionRepository.findByScenarioId(client, scenarioDetails.scenario_id);

    // Get existing answers for this assessment
    const existingAnswers = await answerRepository.findByAssessmentId(client, assessmentId);
    const answeredQuestionIds = new Set(existingAnswers.map(a => a.question_id));

    // Filter out questions that have already been answered
    const unansweredQuestions = questions.filter(q => !answeredQuestionIds.has(q.question_id));

    // If all questions are answered, return the scenario with an empty questions array
    if (unansweredQuestions.length === 0) {
      return {
        assessment_id: assessmentId,
        scenario_id: scenarioDetails.scenario_id,
        title: scenarioDetails.scenario_title,
        description: scenarioDetails.scenario_description,
        type: scenarioDetails.scenario_type_name,
        difficulty: scenarioDetails.scenario_difficulty_name,
        index: scenarioDetails.scenario_index,
        totalScenarios,
        questions: [],
        allQuestionsAnswered: true
      };
    }

    const questionIds = unansweredQuestions.map(q => q.question_id);
    const options = questionIds.length > 0 ?
      await answerRepository.findByQuestionIdsForAssessment(client, questionIds) : [];

    // Structure the data for the single scenario
    const optionsByQuestionId = options.reduce((acc, o) => {
      (acc[o.question_id] = acc[o.question_id] || []).push(o);
      return acc;
    }, {});

    const scenarioResult = {
      assessment_id: assessmentId,
      scenario_id: scenarioDetails.scenario_id,
      title: scenarioDetails.scenario_title,
      description: scenarioDetails.scenario_description,
      type: scenarioDetails.scenario_type_name,
      difficulty: scenarioDetails.scenario_difficulty_name,
      index: scenarioDetails.scenario_index,
      totalScenarios,
      questions: unansweredQuestions.map(q => ({
        question_id: q.question_id,
        question_text: q.question_text,
        options: (optionsByQuestionId[q.question_id] || []).map(opt => ({
          option_id: opt.question_option_id,
          label: opt.label,
          value: opt.value
        }))
      }))
    };

    return scenarioResult;

  } catch (error) {
    console.error(`Error fetching scenario at index ${scenarioIndex} for assessment ${assessmentId}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Gets the user's active assessment or creates a new one if none exists
 * @param {string} googleId - The user's Google ID
 * @returns {Promise<object>} The active assessment
 */
export async function getOrCreateActiveAssessment(googleId) {
    const client = await pool.connect();
    try {
        // First try to get an active assessment
        const activeAssessment = await assessmentRepository.getActiveAssessment(client, googleId);
        
        if (activeAssessment) {
            // If there's an active assessment, get its first scenario
            const firstScenario = await getScenarioForDisplay(activeAssessment.assessment_id, 1);
            return {
                ...activeAssessment,
                ...firstScenario
            };
        }

        // If no active assessment exists, create a new one
        const newAssessment = await createAssessmentWithRandomScenarios(googleId);
        const firstScenario = await getScenarioForDisplay(newAssessment.assessmentId, 1);
        
        return {
            ...newAssessment,
            ...firstScenario
        };
    } finally {
        client.release();
    }
}

// ... other assessment service functions


