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
      question_text: "You found that a third-party API is down. How do you handle this?"
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
      question_text: "The production website is showing a blank page. What's your first step?"
    }
  ]
};

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
        scenario: MOCK_SCENARIO
    };
}

export const submitAssessment = async (assessmentId) => {
    // Mock submission result
    return {
        totalScore: 2,
        typeScores: {
            "Technical": 2
        },
        resultSummary: "Total: 2 (Technical: 2)"
    };
};

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
            scenario: MOCK_SCENARIO
        };
        return assessment;
    } catch (error) {
        console.error('Error in createAssessment service:', error);
        throw new Error('Failed to create assessment');
    }
};
