import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
dotenv.config();

const app = express();

app.use(helmet());
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
