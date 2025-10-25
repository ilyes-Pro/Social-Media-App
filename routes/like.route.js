import express from 'express';
import {
  likePost,
  showUsersLikesPost,
} from '../controllers/like.controller.js';
import passport from 'passport';

const router = express.Router();

router.post(
  '/likePost/:id',
  passport.authenticate('jwt', { session: false }),
  likePost
);
router.get('/showUsersLikesPost/:id', showUsersLikesPost);

export default router;
