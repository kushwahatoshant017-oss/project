import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(50).optional(),
  lastName: Joi.string().trim().max(50).optional(),
  avatarUrl: Joi.string().uri().optional().allow(''),
  unitSystem: Joi.string().valid('METRIC', 'IMPERIAL').optional(),
});
