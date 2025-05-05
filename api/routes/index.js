import { Router } from 'express';
import usersRoutes from './userRoutes.js';

const router = Router();

// Mount API routes
router.use('/users', usersRoutes);

export default router;