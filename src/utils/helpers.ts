import { PaginationParams } from '@types/index';
import { v4 as uuidv4 } from 'uuid';

export function sanitizeString(input: string): string {
  return input.replace(/[<>"'&]/g, '');
}

export function parsePagination(query: {
  page?: string;
  limit?: string;
}): PaginationParams {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function generateUUID(): string {
  return uuidv4();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function extractIpAddress(req: { ip?: string; headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
  }
  return req.ip || '0.0.0.0';
}

export function extractUserAgent(req: { headers: Record<string, string | string[] | undefined> }): string {
  const ua = req.headers['user-agent'];
  return Array.isArray(ua) ? ua[0] : ua || 'Unknown';
}
