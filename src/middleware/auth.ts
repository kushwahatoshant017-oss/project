import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import { AuthRequest, JwtPayload } from '@typings/index';
import { ApiError } from '@utils/apiError';
import prisma from '@database/client';
import logger from '@utils/logger';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized('No authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw ApiError.unauthorized('Invalid authorization format. Use: Bearer <token>');
    }

    const token = parts[1];

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true, deletedAt: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    if (user.deletedAt) {
      throw ApiError.forbidden('Account has been deleted');
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      logger.error('Authentication error', { error });
      next(ApiError.unauthorized('Authentication failed'));
    }
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw ApiError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const hasAllPermissions = permissions.every((perm) =>
        req.user!.permissions.includes(perm as never)
      );

      if (!hasAllPermissions) {
        throw ApiError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
