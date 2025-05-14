import express from 'express';
import { createAssessment, getAssessment, getAssessments, submitScenarioHandler, getAssessmentScenarioByIndex } from '../controllers/assessmentController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/create', verifyGoogleIdToken, createAssessment);
router.get('/history', verifyGoogleIdToken, getAssessments);
router.get('/:id', verifyGoogleIdToken, getAssessment);
router.get('/:id/scenarios/:scenarioIndex', verifyGoogleIdToken, getAssessmentScenarioByIndex);
router.post('/submit-scenario', verifyGoogleIdToken, submitScenarioHandler);

export default router;