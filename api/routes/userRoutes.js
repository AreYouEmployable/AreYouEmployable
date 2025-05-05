import express from 'express';
import getUsers from '../controllers/userController.js';

const router = express.Router();

// Add auth middleware and controller

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', getUsers);


export default router;