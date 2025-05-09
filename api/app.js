import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import swaggerOptions from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});


// Routes
app.use('/api', routes);

// API routes
app.use('auth', authRoutes);
app.use('user', userRoutes);
app.use('assessment', assessmentRoutes);
app.use('/', routes);

app.listen(process.env.PORT, async () => {
if (process.env.ENVIRONMENT === 'production') {
    console.log(`🚀 Server running on ${process.env.BASE_URL}`)
} else {

app.listen(process.env.PORT, async () => { 
    if (process.env.ENVIRONMENT === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`)
    } else {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    };
});
    }});
export default app;