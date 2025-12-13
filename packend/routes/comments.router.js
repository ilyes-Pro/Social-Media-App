import express from 'express';
import {
  getCommentsByPostId,
  addComment,
} from '../controllers/comments.controller.js';
import passport from 'passport';

const router = express.Router();

router.get('/posts/:id', getCommentsByPostId);
router.post(
  '/posts/:id/AddComments',
  passport.authenticate('jwt', { session: false }),
  addComment
);

export default router;
