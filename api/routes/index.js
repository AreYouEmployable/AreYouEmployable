import { Router } from 'express';
import usersRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import questionRoutes from './questionRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/assessment', assessmentRoutes);


router.use('/question', questionRoutes)
export default router;