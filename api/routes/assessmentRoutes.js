import express from 'express';
import { createAssessment, getAssessment, getAssessments, submitAssessmentHandler } from '../controllers/assessmentController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/', verifyGoogleIdToken, createAssessment);
router.get('/history', verifyGoogleIdToken, getAssessments);
router.get('/submit', verifyGoogleIdToken, submitAssessmentHandler);
router.get('/:id', verifyGoogleIdToken, getAssessment);

export default router;