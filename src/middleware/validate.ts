import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@utils/apiError';

export function validate(schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errors: Record<string, string[]> = {};
      error.details.forEach((detail) => {
        const key = detail.path.join('.');
        if (!errors[key]) {
          errors[key] = [];
        }
        errors[key].push(detail.message);
      });

      next(ApiError.badRequest('Validation failed', errors));
      return;
    }

    req[source] = value;
    next();
  };
}
