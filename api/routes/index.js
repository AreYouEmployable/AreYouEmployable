import { Router } from 'express';
import usersRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/assessment', assessmentRoutes);

export default router;