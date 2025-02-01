import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import connectDB from './config/database';
import { setupSwagger } from './config/swagger';

import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

import { errorMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());

const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

export default app;
