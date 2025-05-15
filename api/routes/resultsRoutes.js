
import express from 'express';
import { getAssessmentResults } from '../controllers/resultsController.js';

const router = express.Router();

router.get('/:assessmentId/results', getAssessmentResults);

export default router;