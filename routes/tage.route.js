import passport from 'passport';
import express from 'express';
import { createTag, getPostByTagId } from '../controllers/tage.controller.js';

const router = express.Router();

router.post(
  '/createTag/:id',
  passport.authenticate('jwt', { session: false }),
  createTag
);
router.get('/getPostByTagId/:id', getPostByTagId);

export default router;
