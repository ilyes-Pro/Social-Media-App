import express from 'express';
import validate from '../middleware/validate.js';
import { authSchema, shemaUsername } from '../schemas/auth.schema.js';
import {
  register,
  login,
  logout,
  token,
  UdateProfile,
} from '../controllers/auth.controller.js';
import authLimiter from '../config/rateLimit.js';
import { Upload } from '../config/Cloudinary.js';

const router = express.Router();
router.post(
  '/register',
  authLimiter,
  Upload.single('image'),
  validate(authSchema),
  register
);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/token', token);
router.patch(
  '/UdateProfile/:id',
  validate(shemaUsername),
  Upload.single('image'),
  UdateProfile
);

export default router;
