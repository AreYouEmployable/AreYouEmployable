import express from 'express';
import { getScenarioHandler } from '../controllers/scenarioController.js';

const router = express.Router();

router.get('/assessment/:assessmentId/scenario/:scenarioId', getScenarioHandler);

export default router;