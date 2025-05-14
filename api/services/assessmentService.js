import pool from '../database.js';// Your database connection pool
import * as assessmentRepository from '../repositories/assessmentRepository.js';
import * as scenarioRepository from '../repositories/scenarioRepository.js'; // Or import from assessmentRepository if combined
import * as answerRepository from '../repositories/answerRepository.js';
import * as questionRepository from '../repositories/questionRepository.js';

// Mock data for development
// const MOCK_SCENARIO = {
//   scenario_id: 1,
//   scenario_title: "Debugging Challenge",
//   scenario_description: "You've been tasked with fixing a critical bug in production. How do you approach the situation?",
//   type: "Technical",
//   difficulty: "Medium",
//   questions: [
//     {
//       options: [
//         {
//           label: "A",
//           value: "Implement a fallback mechanism",
//           option_id: 5
//         },
//         {
//           label: "B",
//           value: "Wait for the API to come back online",
//           option_id: 6
//         },
//         {
//           label: "C",
//           value: "Add error messaging and graceful degradation",
//           option_id: 7
//         },
//         {
//           label: "D",
//           value: "Complain to the API provider",
//           option_id: 8
//         }
//       ],
//       question_id: 2,
//       question_text: "You found that a third-party API is down. How do you handle this?",
//       answered: true,
//       selected_option: 7
//     },
//     {
//       options: [
//         {
//           label: "A",
//           value: "Immediately roll back to the previous version",
//           option_id: 1
//         },
//         {
//           label: "B",
//           value: "Check browser console and server logs",
//           option_id: 2
//         },
//         {
//           label: "C",
//           value: "Ask another developer what changed",
//           option_id: 3
//         },
//         {
//           label: "D",
//           value: "Try to reproduce the issue locally",
//           option_id: 4
//         }
//       ],
//       question_id: 1,
//       question_text: "The production website is showing a blank page. What's your first step?",
//       answered: true,
//       selected_option: 2
//     },
//     {
//       options: [
//         {
//           label: "A",
//           value: "Write unit tests for the fix",
//           option_id: 9
//         },
//         {
//           label: "B",
//           value: "Deploy immediately to save time",
//           option_id: 10
//         },
//         {
//           label: "C",
//           value: "Inform the product manager only after deployment",
//           option_id: 11
//         },
//         {
//           label: "D",
//           value: "Merge directly to main and hope for the best",
//           option_id: 12
//         }
//       ],
//       question_id: 3,
//       question_text: "After identifying the root cause and coding a solution, what's a crucial step before deploying the fix to production?",
//       answered: true,
//       selected_option: 9
//     }
//   ]
// };

// const MOCK_SCENARIO_2 = {
//   scenario_id: 2,
//   scenario_title: "Feature Implementation Strategy",
//   scenario_description: "Your team needs to add a complex new feature to an existing application with a tight deadline. How do you plan the development and rollout?",
//   type: "Project Management & Strategy",
//   difficulty: "Hard",
//   questions: [
//     {
//       options: [
//         {
//           label: "A",
//           value: "Build the entire feature in a separate branch and release it all at once",
//           option_id: 13
//         },
//         {
//           label: "B",
//           value: "Break the feature into smaller, manageable chunks and release them incrementally",
//           option_id: 14
//         },
//         {
//           label: "C",
//           value: "Assign the entire feature to the most senior developer to ensure speed",
//           option_id: 15
//         },
//         {
//           label: "D",
//           value: "Delay other less critical tasks and have the whole team work on this one feature",
//           option_id: 16
//         }
//       ],
//       question_id: 4, // Ensuring unique question_id across all scenarios if they were ever to be combined
//       question_text: "What is the best approach for developing and releasing this complex feature under a tight deadline?",
//       answered: false
//     },
//     {
//       options: [
//         {
//           label: "A",
//           value: "Skip thorough testing to meet the deadline, fix bugs later",
//           option_id: 17
//         },
//         {
//           label: "B",
//           value: "Implement comprehensive unit, integration, and E2E tests even if it pushes the deadline slightly",
//           option_id: 18
//         },
//         {
//           label: "C",
//           value: "Rely only on manual QA testing performed just before release",
//           option_id: 19
//         },
//         {
//           label: "D",
//           value: "Use a feature flag to deploy the feature to production but only enable it for internal testers initially",
//           option_id: 20
//         }
//       ],
//       question_id: 5,
//       question_text: "How should you approach testing for this new complex feature?",
//       answered: false
//     },
//     {
//       options: [
//         {
//           label: "A",
//           value: "Launch the feature to all users simultaneously with a big announcement",
//           option_id: 21
//         },
//         {
//           label: "B",
//           value: "Perform a phased rollout, releasing to a small percentage of users first and monitoring feedback",
//           option_id: 22
//         },
//         {
//           label: "C",
//           value: "Make it an opt-in beta feature for a few months before full release",
//           option_id: 23
//         },
//         {
//           label: "D",
//           value: "Release it silently without any announcement to see if users notice",
//           option_id: 24
//         }
//       ],
//       question_id: 6,
//       question_text: "What rollout strategy would minimize risk and allow for feedback collection?",
//       answered: false
//     }
//   ]
// };

// Example of how you might store them in a list if needed
// const ALL_SCENARIOS = [MOCK_SCENARIO, MOCK_SCENARIO_2];

// You can then access them like:
// console.log(ALL_SCENARIOS[0].scenario_title);
// console.log(ALL_SCENARIOS[1].questions[0].question_text);
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
export async function createAssessmentWithRandomScenarios(userId, numberOfScenarios = 2, initialStatusId = 1) {
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
      // Scenario at this index not found for this assessment, or assessment itself might not exist.
      // To be more specific, you could first check if the assessment exists.
      return null;
    }

    const questions = await questionRepository.findByScenarioId(client, scenarioDetails.scenario_id);

    const questionIds = questions.map(q => q.question_id);
    const options = questionIds.length > 0 ?
      await answerRepository.findByQuestionIdsForAssessment(client, questionIds) : [];

    // Structure the data for the single scenario
    const optionsByQuestionId = options.reduce((acc, o) => {
      (acc[o.question_id] = acc[o.question_id] || []).push(o);
      return acc;
    }, {});

    const scenarioResult = {
      assessment_id: assessmentId, // Good to include for context
      scenario_id: scenarioDetails.scenario_id,
      title: scenarioDetails.scenario_title,
      description: scenarioDetails.scenario_description,
      type: scenarioDetails.scenario_type_name,
      difficulty: scenarioDetails.scenario_difficulty_name,
      index: scenarioDetails.scenario_index,
      totalScenarios:2,
      questions: questions.map(q => ({
        question_id: q.question_id,
        question_text: q.question_text,
        // explanation: q.explanation, // Decide if/when to send this.
        // answered: false, // These would come from user_answers table if displaying progress
        // selected_option: null, // These would come from user_answers table
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
// ... other assessment service functions


