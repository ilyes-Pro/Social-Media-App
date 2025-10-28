import express from 'express';

import { friendReq } from '../controllers/friendships.controller.js';
import passport from 'passport';

const router = express.Router();

router.post(
  '/friendReqt/:id',
  passport.authenticate('jwt', { session: false }),
  friendReq
);

export default router;
