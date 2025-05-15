import { sendSuccess, sendError } from '../utils/response.js';
import getAssessmentResultsService from '../services/resultsService.js';

export const getAssessmentResults = async (req, res) => {
    console.log(req.user)
  const { assessmentId } = req.params;
  try {
    const results = await getAssessmentResultsService(assessmentId);
    sendSuccess(res, 200, 'Assessment results fetched successfully', results);
  } catch (error) {
    console.error("Error fetching and sending results:", error);
    return sendError(res, 500, 'Failed to fetch assessment results');
  }
};