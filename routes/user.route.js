import express from 'express';
import {
  users,
  showUser,
  searchUser,
  userPosts,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/user', users);
router.get('/user/:id', showUser);
router.get('/searchUser', searchUser);
router.get('/user/:id/post', userPosts);

export default router;
