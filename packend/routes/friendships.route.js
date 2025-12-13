import express from 'express';

import {
  SendAcceptRequerst,
  Cancel_reauest_sender_receiver,
  Unfriend,
  showReqFriend,
  showALLFriend,
} from '../controllers/friendships.controller.js';
import passport from 'passport';

const router = express.Router();

router.post(
  '/SendAcceptRequerst/:id',
  passport.authenticate('jwt', { session: false }),
  SendAcceptRequerst
);

router.delete(
  '/Cancel/:id',
  passport.authenticate('jwt', { session: false }),
  Cancel_reauest_sender_receiver
);
router.delete(
  '/Unfriend/:id',
  passport.authenticate('jwt', { session: false }),
  Unfriend
);
router.get(
  '/showReqFriend/:id',

  showReqFriend
);
router.get('/showALLFriend/:id', showALLFriend);

export default router;
