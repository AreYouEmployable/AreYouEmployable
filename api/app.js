import express from 'express';
import dotenv from 'dotenv';

import assessmentRoutes from './routes/assessmentRoutes.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import swaggerOptions from './config/swagger.js';

import authRoutes from './routes/authRoutes.js';
import { verifyJWT } from './middlewares/authMiddleware.js';

const app = express();
dotenv.config();


// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', async (req, res) => {
    res.status(200).json({ message: 'API running and healthy' });
});


// API routes
app.use('/api', routes);

app.use('/api/auth', authRoutes);

app.get('/protected', verifyJWT, (req, res) => {
    res.json({ message: 'You are authenticated!', user: req.user });
});

app.listen(process.env.PORT, async () => { 
    if (process.env.ENVIRONMENT === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`)
    } else {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    };
});