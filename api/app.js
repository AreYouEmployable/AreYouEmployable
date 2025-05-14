import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import routes from './routes/index.js';
import swaggerOptions from './config/swagger.js';
import pool from './database.js'

const app = express();
dotenv.config();

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URI || 'http://localhost:5000',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());

// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', async (req, res) => {
    res.status(200).json({ message: 'API running and healthy' });
});

// Endpoint to test database connection
app.get('/api/db-health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()'); // A simple query to check connection
        res.status(200).json({ message: 'Database connection successful!' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Database connection failed.', error: error.message });
    }
});

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

// Routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    if (process.env.ENVIRONMENT === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`);
    } else {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    }
});

export default app;

