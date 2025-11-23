import Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
