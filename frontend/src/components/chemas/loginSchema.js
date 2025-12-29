// schemas/loginSchema.js
import { z } from 'zod';

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,128}$/;

const email = z.string().email('Invalid email address');
const password = z
  .string()
  .regex(passwordRegex, 'Password must be at least 8 characters with Number');

const username = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters long.')
  .max(30, 'Username must be at most 30 characters long.')
  .regex(/^[a-zA-Z0-9]+$/, 'Username may contain only letters and numbers.');

const fullname = z
  .string()
  .trim()
  .min(3, 'Full name must be at least 3 characters long.')
  .max(30, 'Full name must be at most 30 characters long.');

const confirmPassword = z.string().trim();

export const loginSchema = z.object({
  email: email,
  password: password,
});

export const ForgotPasswordSchema = z.object({
  email: email,
});

export const SignUpchema = z
  .object({
    fullname,
    username,
    email,
    password,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
