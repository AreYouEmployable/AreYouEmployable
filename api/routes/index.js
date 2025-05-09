import { Router } from 'express';
import usersRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/assessment', assessmentRoutes);

export default router;