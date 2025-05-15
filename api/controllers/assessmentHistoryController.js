import { sendSuccess, sendError } from '../utils/response.js';
import { getAssessmentHistoryService } from '../services/assessmentHistoryService.js';

export const getAssessmentHistory = async (req, res) => {
  try {
    const googleId = req.user?.sub; 

    if (!googleId) {
      return sendError(res, 401, 'Unauthorized: User Google ID not found');
    }

    const history = await getAssessmentHistoryService(googleId);
    return sendSuccess(res, 200, 'Assessment history fetched successfully', history);

  } catch (error) {
    console.error("Error fetching assessment history:", error);
    return sendError(res, 500, 'Failed to fetch assessment history');
  }
};

export default getAssessmentHistory;