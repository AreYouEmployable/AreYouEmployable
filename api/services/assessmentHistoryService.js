import { getAssessmentHistoryRepository } from '../repositories/assessmentHistoryRepository.js';

export const getAssessmentHistoryService = async (googleId) => {
  try {
    const history = await getAssessmentHistoryRepository(googleId);
    return history;
  } catch (error) {
    console.error("Error fetching assessment history from repository:", error);
    throw error; 
  }
};