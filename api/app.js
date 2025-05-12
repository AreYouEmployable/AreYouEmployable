import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import routes from './routes/index.js';
import swaggerOptions from './config/swagger.js';

const app = express();
dotenv.config();

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URI || 'http://localhost:5000',
    credentials: true
}));

app.use(express.json());

// Generate Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', async (req, res) => {
    res.status(200).json({ message: 'API running and healthy' });
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

