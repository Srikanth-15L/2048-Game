import Joi from 'joi';

export const createUrlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'URL must be a valid HTTP or HTTPS URL',
      'any.required': 'URL is required'
    }),
  
  validity: Joi.number()
    .integer()
    .min(1)
    .max(525600) // 1 year in minutes
    .default(30)
    .messages({
      'number.base': 'Validity must be a number',
      'number.integer': 'Validity must be an integer',
      'number.min': 'Validity must be at least 1 minute',
      'number.max': 'Validity cannot exceed 1 year (525600 minutes)'
    }),
  
  shortcode: Joi.string()
    .alphanum()
    .min(1)
    .max(20)
    .optional()
    .messages({
      'string.alphanum': 'Shortcode must contain only letters and numbers',
      'string.min': 'Shortcode must be at least 1 character',
      'string.max': 'Shortcode cannot exceed 20 characters'
    })
});

export const shortcodeParamSchema = Joi.object({
  shortcode: Joi.string()
    .alphanum()
    .required()
    .messages({
      'string.alphanum': 'Shortcode must contain only letters and numbers',
      'any.required': 'Shortcode is required'
    })
});