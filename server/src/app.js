// src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import orderRoutes from './routes/orderRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Serves mock-uploaded files in dev when USE_MOCK_STORAGE=true.
app.use('/mock-uploads', express.static(path.join(process.cwd(), 'mock-uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/orders', orderRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/files', fileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
