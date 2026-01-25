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
  DeleteUser_Profile_Imge,
  resendVerificationCode,
} from '../controllers/auth.controller.js';
import authLimiter from '../config/rateLimit.js';
import { Upload } from '../config/Cloudinary.js';
import passport from 'passport';
import '../config/passport.js';

const router = express.Router();

router.post('/register', authLimiter, validate(authSchema), register);
router.post('/resendVerificationCode', authLimiter, resendVerificationCode);
router.post('/verify', authLimiter, verify);
router.post(
  '/UploadProfile',
  passport.authenticate('jwt', { session: false }),
  // Upload.single('image'),
  Upload.fields([
    { name: 'img_user', maxCount: 1 },
    { name: 'p_img', maxCount: 1 },
  ]),
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
  '/UdateProfile',
  passport.authenticate('jwt', { session: false }),
  validate(shemaUsername),
  Upload.fields([
    { name: 'img_user', maxCount: 1 },
    { name: 'p_img', maxCount: 1 },
  ]),
  UdateProfile
);

router.delete(
  '/DeleteImge_user_profile/:type',
  passport.authenticate('jwt', { session: false }),

  DeleteUser_Profile_Imge
);

export default router;
