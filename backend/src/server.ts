import express from 'express';
import cors from 'cors';
import { createLogger } from 'logging-middleware';
import urlRoutes from './routes/urlRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize logger
const logger = createLogger('http://20.244.56.144', 'backend');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use(logger.expressMiddleware());

// Routes
app.use('/', urlRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  await logger.info('service', `URL Shortener Backend started on port ${PORT}`);
  await logger.info('service', `Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 URL Shortener Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;