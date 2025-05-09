import express from 'express';
import { submitAnswerHandler } from '../controllers/answerController.js';

const router = express.Router();

router.post('/', submitAnswerHandler);

export default router;