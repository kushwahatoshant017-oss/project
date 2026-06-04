import { Request } from 'express';
import { Role } from '@prisma/client';

export type Permission = 'READ_USER' | 'WRITE_USER' | 'DELETE_USER' | 'READ_WEATHER' | 'READ_AQI' | 'READ_FORECAST' | 'WRITE_FAVORITES' | 'DELETE_FAVORITES' | 'READ_ALERTS' | 'WRITE_ALERTS' | 'DELETE_ALERTS' | 'READ_NOTIFICATIONS' | 'WRITE_NOTIFICATIONS' | 'MANAGE_ROLES' | 'MANAGE_PERMISSIONS' | 'VIEW_AUDIT_LOGS' | 'ADMIN_ACCESS';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherQuery {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial';
}

export interface ForecastQuery extends WeatherQuery {
  days?: number;
  hours?: number;
}

export interface DateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface CacheOptions {
  ttl?: number;
  key: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  channel?: 'EMAIL' | 'PUSH' | 'IN_APP';
  metadata?: Record<string, unknown>;
}
