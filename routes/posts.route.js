import express from 'express';
import passport from 'passport';
import { Upload } from '../config/Cloudinary.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/posts.controller.js';

const router = express.Router();

router.post(
  '/createPost',
  passport.authenticate('jwt', { session: false }),
  Upload.single('image'),
  createPost
);
router.get(
  '/getPost',

  getAllPosts
);

router.get('/getPost/:id', getPostById);

router.patch(
  '/updatePost/:id_post',
  passport.authenticate('jwt', { session: false }),
  Upload.single('image'),
  updatePost
);

router.delete(
  '/deletePost/:id_post',
  passport.authenticate('jwt', { session: false }),
  deletePost
);

export default router;
