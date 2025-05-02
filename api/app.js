import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use('/health', async (req, res) => {
    res.status(200).json({ message: 'API running and healthy' });
});

const environment = process.env.ENVIRONMENT;

app.listen(process.env.PORT, async () => { 
    // connect to database (will do later)
    if (environment === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`)
    } else {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    };
});