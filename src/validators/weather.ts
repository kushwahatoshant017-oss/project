import Joi from 'joi';

export const weatherQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required',
  }),
  lon: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required',
  }),
  units: Joi.string().valid('metric', 'imperial').optional().default('metric'),
});

export const historyQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Start date must be ISO format (YYYY-MM-DD)',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().iso().required().messages({
    'date.format': 'End date must be ISO format (YYYY-MM-DD)',
    'any.required': 'End date is required',
  }),
  units: Joi.string().valid('metric', 'imperial').optional().default('metric'),
});

export const forecastQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
  days: Joi.number().min(1).max(16).optional().default(7),
  units: Joi.string().valid('metric', 'imperial').optional().default('metric'),
});

export const hourlyForecastQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
  hours: Joi.number().min(1).max(168).optional().default(48),
  units: Joi.string().valid('metric', 'imperial').optional().default('metric'),
});
