import express from 'express';
import { createAssessment, getAssessment, getAssessments } from '../controllers/assessmentController';

const router = express.Router();

// Add auth middleware and controller
// TODO add authenticated middleware and set the user id to the req object
router.post('/', createAssessment);
router.get('/:id', getAssessment);
router.get('/history', getAssessments);

export default router;