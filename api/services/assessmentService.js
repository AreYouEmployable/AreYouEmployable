import * as assessmentRepository from '../repositories/assessmentRepository.js';

// Mock data for development
const MOCK_SCENARIO = {
  scenario_id: 1,
  scenario_title: "Debugging Challenge",
  scenario_description: "You've been tasked with fixing a critical bug in production. How do you approach the situation?",
  type: "Technical",
  difficulty: "Medium",
  questions: [
    {
      options: [
        {
          label: "A",
          value: "Implement a fallback mechanism",
          option_id: 5
        },
        {
          label: "B",
          value: "Wait for the API to come back online",
          option_id: 6
        },
        {
          label: "C",
          value: "Add error messaging and graceful degradation",
          option_id: 7
        },
        {
          label: "D",
          value: "Complain to the API provider",
          option_id: 8
        }
      ],
      question_id: 2,
      question_text: "You found that a third-party API is down. How do you handle this?",
      answered: true,
      selected_option: 7
    },
    {
      options: [
        {
          label: "A",
          value: "Immediately roll back to the previous version",
          option_id: 1
        },
        {
          label: "B",
          value: "Check browser console and server logs",
          option_id: 2
        },
        {
          label: "C",
          value: "Ask another developer what changed",
          option_id: 3
        },
        {
          label: "D",
          value: "Try to reproduce the issue locally",
          option_id: 4
        }
      ],
      question_id: 1,
      question_text: "The production website is showing a blank page. What's your first step?",
      answered: true,
      selected_option: 2
    },
    {
      options: [
        {
          label: "A",
          value: "Write unit tests for the fix",
          option_id: 9
        },
        {
          label: "B",
          value: "Deploy immediately to save time",
          option_id: 10
        },
        {
          label: "C",
          value: "Inform the product manager only after deployment",
          option_id: 11
        },
        {
          label: "D",
          value: "Merge directly to main and hope for the best",
          option_id: 12
        }
      ],
      question_id: 3,
      question_text: "After identifying the root cause and coding a solution, what's a crucial step before deploying the fix to production?",
      answered: true,
      selected_option: 9
    }
  ]
};

const MOCK_SCENARIO_2 = {
  scenario_id: 2,
  scenario_title: "Feature Implementation Strategy",
  scenario_description: "Your team needs to add a complex new feature to an existing application with a tight deadline. How do you plan the development and rollout?",
  type: "Project Management & Strategy",
  difficulty: "Hard",
  questions: [
    {
      options: [
        {
          label: "A",
          value: "Build the entire feature in a separate branch and release it all at once",
          option_id: 13
        },
        {
          label: "B",
          value: "Break the feature into smaller, manageable chunks and release them incrementally",
          option_id: 14
        },
        {
          label: "C",
          value: "Assign the entire feature to the most senior developer to ensure speed",
          option_id: 15
        },
        {
          label: "D",
          value: "Delay other less critical tasks and have the whole team work on this one feature",
          option_id: 16
        }
      ],
      question_id: 4, // Ensuring unique question_id across all scenarios if they were ever to be combined
      question_text: "What is the best approach for developing and releasing this complex feature under a tight deadline?",
      answered: false
    },
    {
      options: [
        {
          label: "A",
          value: "Skip thorough testing to meet the deadline, fix bugs later",
          option_id: 17
        },
        {
          label: "B",
          value: "Implement comprehensive unit, integration, and E2E tests even if it pushes the deadline slightly",
          option_id: 18
        },
        {
          label: "C",
          value: "Rely only on manual QA testing performed just before release",
          option_id: 19
        },
        {
          label: "D",
          value: "Use a feature flag to deploy the feature to production but only enable it for internal testers initially",
          option_id: 20
        }
      ],
      question_id: 5,
      question_text: "How should you approach testing for this new complex feature?",
      answered: false
    },
    {
      options: [
        {
          label: "A",
          value: "Launch the feature to all users simultaneously with a big announcement",
          option_id: 21
        },
        {
          label: "B",
          value: "Perform a phased rollout, releasing to a small percentage of users first and monitoring feedback",
          option_id: 22
        },
        {
          label: "C",
          value: "Make it an opt-in beta feature for a few months before full release",
          option_id: 23
        },
        {
          label: "D",
          value: "Release it silently without any announcement to see if users notice",
          option_id: 24
        }
      ],
      question_id: 6,
      question_text: "What rollout strategy would minimize risk and allow for feedback collection?",
      answered: false
    }
  ]
};

// Example of how you might store them in a list if needed
const ALL_SCENARIOS = [MOCK_SCENARIO, MOCK_SCENARIO_2];

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
    // For mock data, we'll just return the scenario data
    return {
        id: assessmentId,
        user_id: userId,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        scenario: ALL_SCENARIOS
    };
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
    try {
        console.log('Received data:', { assessmentId, scenarioIndex, answers });

        // Validate scenario index
        if (scenarioIndex < 0 || scenarioIndex >= ALL_SCENARIOS.length) {
            throw new Error(`Invalid scenario index: ${scenarioIndex}`);
        }

        // Get the current scenario
        const scenario = ALL_SCENARIOS[scenarioIndex];
        if (!scenario || !scenario.questions) {
            throw new Error('Invalid scenario data');
        }
        
        // Process the answers for this scenario
        const processedAnswers = scenario.questions.map((question, questionIndex) => {
            const answer = answers.find(a => a.questionIndex === questionIndex);
            if (!answer) {
                throw new Error(`Missing answer for question index ${questionIndex}`);
            }

            // Get the array index from selectedOptions
            const selectedOptionIndex = answer.selectedOptions[0];
            if (selectedOptionIndex === undefined || selectedOptionIndex < 0 || selectedOptionIndex >= question.options.length) {
                throw new Error(`Invalid option index ${selectedOptionIndex} for question ${questionIndex}`);
            }

            // Get the actual option using the array index
            const selectedOption = question.options[selectedOptionIndex];
            
            console.log(`Processing question ${questionIndex}:`, {
                questionId: question.question_id,
                selectedOptionIndex,
                selectedOptionId: selectedOption.option_id,
                availableOptions: question.options.map(o => o.option_id)
            });

            // Update the question in the mock data
            question.answered = true;
            question.selected_option = selectedOption.option_id;

            // For mock purposes, we'll consider the first option as correct
            const isCorrect = selectedOptionIndex === 0;

            return {
                question_id: question.question_id,
                selected_option: selectedOption.option_id,
                is_correct: isCorrect
            };
        });

        // Calculate score for this scenario
        const scenarioScore = processedAnswers.filter(answer => answer.is_correct).length;
        const totalQuestions = scenario.questions.length;
        const scorePercentage = (scenarioScore / totalQuestions) * 100;

        // Update the mock data with the processed answers
        scenario.questions.forEach((question, index) => {
            const processedAnswer = processedAnswers[index];
            question.answered = true;
            question.selected_option = processedAnswer.selected_option;
        });

        // Calculate overall progress
        const totalScenarios = ALL_SCENARIOS.length;
        const completedScenarios = ALL_SCENARIOS.filter(s => 
            s.questions.every(q => q.answered)
        ).length;

        const response = {
            success: true,
            scenarioScore,
            scorePercentage,
            totalQuestions,
            answers: processedAnswers,
            isComplete: scenarioIndex === totalScenarios - 1,
            currentScenario: scenarioIndex + 1,
            totalScenarios,
            completedScenarios,
            progress: (completedScenarios / totalScenarios) * 100
        };

        console.log('Response:', response);
        return response;

    } catch (error) {
        console.error('Error in submitScenario:', error);
        throw error;
    }
};

// Add correct_option_id to mock questions for scoring
ALL_SCENARIOS.forEach(scenario => {
    scenario.questions.forEach(question => {
        // For mock purposes, we'll set the first option as correct
        question.correct_option_id = question.options[0].option_id;
    });
});
/**
 * Creates a new assessment for a user
 * @param {string} userId - The ID of the user
 * @returns {object} The created assessment
 * @throws {Error} If assessment creation fails
 */
export const createAssessment = async (userId) => {
    try {
        // Create a mock assessment with the scenario data
        const assessment = {
            id: Date.now(), // Use timestamp as mock ID
            user_id: userId,
            status: 'in_progress',
            created_at: new Date().toISOString(),
            scenario: ALL_SCENARIOS
        };
        return assessment;
    } catch (error) {
        console.error('Error in createAssessment service:', error);
        throw new Error('Failed to create assessment');
    }
};

