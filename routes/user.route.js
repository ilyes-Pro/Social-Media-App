import express from 'express';
import { users, showUser, searchUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/user', users);
router.get('/user/:id', showUser);
router.get('/searchUser', searchUser);

export default router;
