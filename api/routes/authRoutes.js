import express from 'express';
import { verifyCreateOrFetchUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/google/callback', verifyCreateOrFetchUser);

export default router;