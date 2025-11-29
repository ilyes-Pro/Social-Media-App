import express from 'express';
import validate from '../middleware/validate.js';
import {
  authSchema,
  shemaUsername,
  shemaPassword,
  schemaEmail,
} from '../schemas/auth.schema.js';
import {
  register,
  login,
  logout,
  token,
  UdateProfile,
  verify,
  forgotPassword,
  resetPassword,
  UploadProfile,
} from '../controllers/auth.controller.js';
import authLimiter from '../config/rateLimit.js';
import { Upload } from '../config/Cloudinary.js';
import passport from 'passport';
import '../config/passport.js';

const router = express.Router();

router.post('/register', authLimiter, validate(authSchema), register);
router.post('/verify', authLimiter, verify);
router.post(
  '/UploadProfileImage',
  passport.authenticate('jwt', { session: false }),
  Upload.single('image'),
  UploadProfile
);

router.post('/login', authLimiter, validate(shemaPassword), login);
router.post('/forgotPassword', validate(schemaEmail), forgotPassword);
router.patch(
  '/resetPassword/:resetTokenURL',
  validate(shemaPassword),
  resetPassword
);

router.post('/logout', logout);
router.post('/token', token);

router.patch(
  '/UpdateProfile/:id',
  passport.authenticate('jwt', { session: false }),
  validate(shemaUsername),
  Upload.single('image'),
  UdateProfile
);
export default router;
