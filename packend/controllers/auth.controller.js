import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

import crypto from 'crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../config/token.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../config/Eamil.js';
import { GetPublicId } from '../config/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

import redis from '../config/redis.js';

export const register = async (req, res) => {
  const { email, password, username, fullname } = req.body;

  // if (!email || !password || !username) {
  //   return res
  //     .status(404)
  //     .json({ error: 'Email and password or username in not exist ' });
  // }
  try {
    const userExists = await db.query(
      'SELECT * FROM project02.users WHERE email=$1 OR username=$2',
      [email, username]
    );

    if (userExists.rows[0]) {
      return res.status(404).json({ error: 'Email or user name is exist ' });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await redis.set(
      `verificationCode:${email}`,
      verificationCode,
      'EX',
      15 * 60
    );

    await sendVerificationEmail(email, verificationCode);
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.query(
      'INSERT INTO project02.users (username,fullname,email,password) VALUES ($1,$2,$3,$4) RETURNING id_user,username,email',
      [username, fullname, email, hashedPassword]
    );
    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.log('❌ Error in register:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
export const verify = async (req, res) => {
  const { email, code } = req.body;

  try {
    const storedCode = await redis.get(`verificationCode:${email}`);
    console.log('🔄 storedCode from Redis:', storedCode);
    if (!storedCode) {
      return res.status(400).json({ message: 'Code expired or invalid' });
    }

    if (storedCode !== code) {
      return res.status(400).json({ message: 'Invalid code' });
    }
    const result = await db.query(
      'UPDATE project02.users SET is_verified = true WHERE email = $1 RETURNING *',
      [email]
    );

    const user = result.rows[0];
    if (!user)
      return res
        .status(400)
        .json({ message: 'User not found or already verified' });
    const payload = {
      id: user.id_user,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setRefreshCookie(res, refreshToken);

    await redis.del(`verificationCode:${email}`);
    await sendWelcomeEmail(email, user.username);
    res.status(200).json({
      message: 'Email verified successfully',
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const UploadProfile = async (req, res) => {
  // const email = req.user.email;
  // const bio = req.body.bio || '';
  // const imge = req.file?.path || null;
  // const imge_p = req.file?.path || null;

  const email = req.user.email;
  const bio = req.body.bio?.trim();

  const img_user = req.files?.img_user?.[0]?.path || null;
  const p_img = req.files?.p_img?.[0]?.path || null;
  try {
    const Verify = await db.query(
      'SELECT img_user,p_img FROM  project02.users WHERE email=$1',
      [email]
    );
    const user = await db.query(
      'UPDATE project02.users SET img_user=COALESCE($1,img_user),p_img=COALESCE($2,p_img),bio=COALESCE($3,bio) WHERE email=$4 RETURNING *',
      [img_user, p_img, bio, email]
    );
    if (!user.rows[0] || !user.rows[0].is_verified) {
      return res.status(400).json({ error: 'User not found or not verified' });
    }

    if (user.rows[0].img_user && Verify.rows[0].img_user) {
      const publicId = GetPublicId(Verify.rows[0].img_user);
      cloudinary.uploader.destroy(publicId);
    }
    if (user.rows[0].p_img && Verify.rows[0].p_img) {
      const publicId = GetPublicId(Verify.rows[0].p_img);
      cloudinary.uploader.destroy(publicId);
    }

    const { password, ...userWithoutPassword } = user.rows[0];
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

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
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Email not verified' });
    }
    const payload = {
      id: user.id_user,
      email: user.email,
    };
    console.log('this is login : ', payload);
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
  console.log('this is the refersh token : ', process.env.REFRESH_TOKEN_SECRET);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const payload = {
      id: user.id,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setRefreshCookie(res, refreshToken);

    res.json({ accessToken: newAccessToken });
  });
};

export const logout = (req, res) => {
  clearRefreshCookie(res);
  res.json({ message: 'Logged out' });
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    const userExists = await db.query(
      'SELECT * FROM project02.users WHERE email=$1 ',
      [email]
    );
    const user = userExists.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'Email is NOT exist ' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    await redis.set(`forgotPassword:${email}`, resetToken, 'EX', 3600);

    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      message: 'Password reset link sent to your email',
    });
  } catch (err) {
    console.log('❌ Error in forgotPassword:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { password, email } = req.body;
  const { resetTokenURL } = req.params;

  try {
    const resetToken = await redis.get(`forgotPassword:${email}`);
    console.log('🔄 resetToken from Redis:', resetToken);
    console.log('🔄 resetToken from params:', resetTokenURL);
    if (resetToken !== resetTokenURL) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.query(
      'UPDATE project02.users SET password=$1 WHERE email=$2',
      [hashedPassword, email]
    );
    await redis.del(`forgotPassword:${email}`);

    return res.status(200).json({ message: 'Update password is done' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const UdateProfile = async (req, res) => {
  const fullname = req.body.fullname?.trim();
  const bio = req.body.bio?.trim();
  const img_user = req.files?.img_user?.[0]?.path || null;
  const p_img = req.files?.p_img?.[0]?.path || null;

  // const id = parseInt(req.params.id);
  const id = req.user.id_user;

  // if (!fullname && !imge) {
  //   return res.status(404).json({ error: 'enter usernaem or imge to update' });
  // }

  try {
    let olduser = await db.query(
      'SELECT img_user,p_img FROM project02.users WHERE id_user=$1',
      [id]
    );

    if (!olduser.rows[0]) {
      return res.status(404).json({ error: 'user is not exist ' });
    }

    const user = await db.query(
      'UPDATE project02.users SET img_user=COALESCE($1,img_user),p_img=COALESCE($2,p_img),bio=COALESCE($3,bio),fullname=COALESCE($4,fullname) WHERE id_user=$5 RETURNING *',
      [img_user, p_img, bio, fullname, id]
    );

    if (user.rows[0].img_user && olduser.rows[0].img_user) {
      const publicId = GetPublicId(olduser.rows[0].img_user);
      await cloudinary.uploader.destroy(publicId);
    }
    if (user.rows[0].p_img && olduser.rows[0].p_img) {
      const publicId = GetPublicId(olduser.rows[0].p_img);
      await cloudinary.uploader.destroy(publicId);
    }

    const { password, ...userWithoutPassword } = user.rows[0];
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.log('❌ Error in login:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};

export const DeleteUser_Profile_Imge = async (req, res) => {
  try {
    const id = req.user.id_user;
    const { type } = req.params;
    const Imgs = ['p_img', 'img_user'];

    if (!Imgs.includes(type)) {
      return res.status(404).json({ message: 'query is not exist' });
    }
    let user = await db.query(
      `SELECT ${type} FROM project02.users WHERE id_user=$1`,
      [id]
    );

    if (!user.rows[0][type]) {
      return res.status(404).json({ message: 'imge is not exist' });
    }
    const publicId = GetPublicId(user.rows[0][type]);
    await cloudinary.uploader.destroy(publicId);

    const Delete = await db.query(
      ` UPDATE project02.users SET ${type} = NULL WHERE id_user = $1 RETURNING * `,
      [id]
    );

    const { password, ...userWithoutPassword } = Delete.rows[0];
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.log('❌ Error in login:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
