import Joi from 'joi';

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,128}$/;

export const shemaPassword = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .trim()
    .required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

export const authSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .trim()
    .required(),
  password: Joi.string().pattern(passwordRegex).required(),
  username: Joi.string().alphanum().min(3).max(30).trim().required(),
});

export const shemaUsername = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().optional(),
});
