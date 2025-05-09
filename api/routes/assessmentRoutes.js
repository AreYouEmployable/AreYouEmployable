import express from 'express';
import { createAssessment, getAssessment, getAssessments } from '../controllers/assessmentController.js';
import { verifyGoogleIdToken } from '../middlewares/authMiddleware.js'; 
const router = express.Router();

// Add auth middleware and controller
// TODO add authenticated middleware and set the user id to the req object
router.post('/',verifyGoogleIdToken, createAssessment);
router.get('/:id',verifyGoogleIdToken, getAssessment);
router.get('/history',verifyGoogleIdToken, getAssessments);

export default router;