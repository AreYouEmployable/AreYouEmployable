import express from 'express';
import { createAssessment, getAssessment, getAssessments,  } from '../controllers/assessmentController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/create', verifyGoogleIdToken, createAssessment);
router.get('/history', verifyGoogleIdToken, getAssessments);
router.get('/submit', verifyGoogleIdToken, );
router.get('/:id', verifyGoogleIdToken, getAssessment);

export default router;