import express from 'express';

import helmet from 'helmet';
import authRouter from './routes/auth.route.js';
import Cors from './config/Cors.js';
import httpsRedirect from './middleware/httpsRedirect.js';
import fileFilter from './middleware/filterImg.js';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import './config/passport.js';
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
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running on port http://localhost:${port}`);
});
