import { Router } from 'express';
import usersRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import questionRoutes from './questionRoutes.js';
import scenarioRoutes from './scenarioRoutes.js';
import answerRoutes from './answerRoutes.js';
import resultsRoutes from './resultsRoutes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/scenario', scenarioRoutes);
router.use('/question', questionRoutes);
router.use('/answer', answerRoutes);
router.use('/assessments', resultsRoutes);

export default router;