import { Response } from 'express';
import { ApiResponse } from '@types/index';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>
): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: message,
    errors,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): void {
  const totalPages = Math.ceil(total / limit);
  const response = {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(response);
}
