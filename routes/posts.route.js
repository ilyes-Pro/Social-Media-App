import express from 'express';
import passport from 'passport';
import { Upload } from '../config/Cloudinary.js';
import { createPost, getAllPosts } from '../controllers/posts.controller.js';

const router = express.Router();

router.post(
  '/createPost',
  passport.authenticate('jwt', { session: false }),
  Upload.single('image'),
  createPost
);
router.get(
  '/getAllPosts',

  getAllPosts
);

export default router;
