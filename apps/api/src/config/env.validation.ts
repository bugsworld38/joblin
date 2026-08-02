import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().port().default(3000),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),

  WEB_ORIGIN: Joi.string().uri().default('http://localhost:5173'),
  EXTENSION_ORIGIN: Joi.string()
    .uri({ scheme: ['chrome-extension'] })
    .optional(),
});
