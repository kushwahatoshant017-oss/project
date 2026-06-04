import Joi from 'joi';

export const createFavoriteSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required',
  }),
  locationName: Joi.string().trim().max(200).optional().allow(''),
  label: Joi.string().trim().max(50).optional().allow(''),
});

export const favoriteIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid favorite ID format',
    'any.required': 'Favorite ID is required',
  }),
});
