import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../config/token.js';
import { GetPublicId } from '../config/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  const imge = req.file.path;
  if (!email || !password || !username) {
    return res
      .status(404)
      .json({ error: 'Email and password or username in not exist ' });
  }
  try {
    const userExists = await db.query(
      'SELECT * FROM project02.users WHERE email=$1',
      [email]
    );

    if (userExists.rows[0]) {
      return res.status(404).json({ error: 'Email is exist ' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.query(
      'INSERT INTO project02.users (username,img_user,email,password) VALUES ($1,$2,$3,$4) RETURNING id_user,username,img_user,email',
      [username, imge, email, hashedPassword]
    );
    const payload = {
      id: result.rows[0].id_user,
      email: result.rows[0].email,
      username: result.rows[0].username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.log('❌ Error in login:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .json({ error: 'Email and password or username in not exist ' });
  }

  try {
    const userExists = await db.query(
      'SELECT * FROM project02.users WHERE email=$1',
      [email]
    );

    if (!userExists.rows[0]) {
      return res.status(404).json({ error: 'Email is NOT exist ' });
    }
    const user = userExists.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(404).json({ error: 'password or Email is not exist' });
    }
    const payload = {
      id: user.id_user,
      email: user.email,
      username: user.username,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken });
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.log('❌ Error in login:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};

export const token = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken({
      id: user.id_user,
      email: user.email,
      username: user.username,
    });
    const newRefreshToken = generateRefreshToken({
      id: user.id_user,
      email: user.email,
      username: user.username,
    });
    setRefreshCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  });
};

export const logout = (req, res) => {
  clearRefreshCookie(res);
  res.json({ message: 'Logged out' });
};

export const UdateProfile = async (req, res) => {
  const username = req.body.username?.trim();
  const imge = req.file?.path;
  const id = parseInt(req.params.id);

  if (!username && !imge) {
    return res.status(404).json({ error: 'enter usernaem or imge to update' });
  }

  try {
    let olduser = await db.query(
      'SELECT img_user FROM project02.users WHERE id_user=$1',
      [id]
    );

    if (!olduser.rows[0]) {
      return res.status(404).json({ error: 'user is not exist ' });
    }
    const oldImg = olduser.rows[0].img_user;
    let result = await db.query(
      'UPDATE project02.users SET username=COALESCE($1, username) ,img_user=COALESCE($2, img_user) WHERE id_user=$3  RETURNING  id_user,username,img_user',
      [username, imge, id]
    );

    if (imge && oldImg) {
      const publicId = GetPublicId(oldImg);
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.log('❌ Error in login:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
