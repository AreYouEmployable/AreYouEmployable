import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import swaggerOptions from './config/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', async (req, res) => {
    res.status(200).json({ message: 'API running and healthy' });
});

// API routes
app.use('auth', authRoutes);
app.use('user', userRoutes);
app.use('assessment', assessmentRoutes);
app.use('/', routes);

// Serve static files from client's public directory
app.use('/public', express.static(path.join(__dirname, '../client/public')));

// Handle OAuth callback route
app.get('/oauth2callback', (req, res) => {
    res.redirect(`/api/auth/google/callback${req.url}`);
});

app.listen(process.env.PORT, async () => { 
    if (process.env.ENVIRONMENT === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`)
    } else {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    };
});

export default app;