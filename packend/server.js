import express from 'express';

import helmet from 'helmet';
import authRouter from './routes/auth.route.js';
import Cors from './config/Cors.js';
import httpsRedirect from './middleware/httpsRedirect.js';
import fileFilter from './middleware/filterImg.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import postRouter from './routes/posts.route.js';
import passport from 'passport';
import tagRouter from './routes/tage.route.js';
import './config/passport.js';
import commentRouter from './routes/comments.router.js';
import likeRouter from './routes/like.route.js';
import friendships from './routes/friendships.route.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  app.use(Cors());
  app.use(httpsRedirect);
}

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/tags', tagRouter);
app.use('/api/friendships', friendships);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running on port http://localhost:${port}`);
});
