
import express from 'express';
import { getAssessmentResults } from '../controllers/resultsController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/:assessmentId/results', verifyGoogleIdToken, getAssessmentResults);

export default router;