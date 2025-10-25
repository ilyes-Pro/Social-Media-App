import passport from 'passport';
import express from 'express';
import { createTag } from '../controllers/tage.controller.js';

const router = express.Router();

router.post(
  '/createTag/:id',
  passport.authenticate('jwt', { session: false }),
  createTag
);

export default router;
