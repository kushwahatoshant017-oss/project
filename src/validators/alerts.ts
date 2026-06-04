import Joi from 'joi';

export const createAlertSchema = Joi.object({
  locationLat: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Location latitude is required',
  }),
  locationLon: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Location longitude is required',
  }),
  locationName: Joi.string().trim().max(200).optional().allow(''),
  alertType: Joi.string()
    .valid('TEMPERATURE', 'PRECIPITATION', 'WIND', 'UV_INDEX', 'AIR_QUALITY', 'STORM', 'CUSTOM')
    .required()
    .messages({
      'any.only': 'Invalid alert type',
      'any.required': 'Alert type is required',
    }),
  condition: Joi.string()
    .valid('ABOVE', 'BELOW', 'EQUAL', 'CHANGES_BY')
    .required()
    .messages({
      'any.only': 'Invalid condition',
      'any.required': 'Condition is required',
    }),
  thresholdValue: Joi.number().required().messages({
    'any.required': 'Threshold value is required',
  }),
  unitSystem: Joi.string().valid('METRIC', 'IMPERIAL').optional().default('METRIC'),
  cooldownMinutes: Joi.number().min(1).max(1440).optional().default(60),
});

export const alertIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid alert ID format',
    'any.required': 'Alert ID is required',
  }),
});
