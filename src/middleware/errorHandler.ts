import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@utils/apiError';
import logger from '@utils/logger';
import config from '@config/index';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    logger.warn('Operational error', {
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  logger.error('Unexpected error', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    name: err.name,
  });

  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'Not Found',
    timestamp: new Date().toISOString(),
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
