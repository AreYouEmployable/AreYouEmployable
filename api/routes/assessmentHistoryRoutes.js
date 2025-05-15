import express from 'express';
import { getAssessmentHistory } from '../controllers/assessmentHistoryController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; // Assuming you want to protect this route as well

const router = express.Router();

router.get('/history', verifyGoogleIdToken, getAssessmentHistory);

export default router;