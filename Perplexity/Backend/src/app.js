import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Allow requests from the Vite dev server on port 5173
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Perplexity API running' }));

export default app;
