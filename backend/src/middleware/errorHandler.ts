import { Request, Response, NextFunction } from 'express';
import { createLogger } from 'logging-middleware';

const logger = createLogger('http://20.244.56.144', 'backend');

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('middleware', `Unhandled error: ${error.message}`);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.warn('middleware', `404 - Route not found: ${req.method} ${req.path}`);
  
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
};