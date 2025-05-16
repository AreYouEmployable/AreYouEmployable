import express from 'express';
import { getAssessmentHistory } from '../controllers/assessmentHistoryController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/history', verifyGoogleIdToken, getAssessmentHistory);

export default router;