import { RESP_TYPES } from 'redis';
import db from '../config/db.js';

export const users = async (req, res) => {
  const limite = req.query.limite || 15;
  const page = req.query.page || 1;
  try {
    const total_usersResult = await db.query(
      'SELECT COUNT(*) AS total_users FROM project02.users WHERE is_verified = true'
    );
    const total_users = parseInt(total_usersResult.rows[0].total_users);

    const result = await db.query(
      'SELECT id_user,username,email,img_user FROM project02.users WHERE is_verified = true LIMIT $1 OFFSET $2',
      [limite, (page - 1) * limite]
    );

    const users = result.rows;
    res.status(200).json({
      data: users,
      meta: {
        current_page: page,
        last_page: Math.ceil(total_users / limite),
        per_page: limite,
        total_users: total_users,
        from: (page - 1) * limite + 1,
        to: (page - 1) * limite + users.length,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const showUser = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ message: 'Enter your id' });
  }

  try {
    const userResult = await db.query(
      `SELECT id_user, username, email, img_user
       FROM project02.users
       WHERE id_user = $1 AND is_verified = true`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const commentResult = await db.query(
      `SELECT COUNT(*) AS contCom FROM project02.comments WHERE id_user = $1`,
      [id]
    );
    const comments_count = parseInt(commentResult.rows[0].contcom);

    const postResult = await db.query(
      `SELECT COUNT(*) AS contPost FROM project02.posts WHERE id_user = $1`,
      [id]
    );
    const posts_count = parseInt(postResult.rows[0].contpost);

    return res.status(200).json({
      user: userResult.rows[0],
      stats: {
        comments_count,
        posts_count,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchUser = async (req, res) => {
  const search = req.query.search;

  if (!search) {
    return res.stats(400).json({ message: 'Please provide a search term' });
  }

  try {
    const result = await db.query(
      `SELECT id_user, username, email, img_user
       FROM project02.users
       WHERE username LIKE $1 AND is_verified = true`,
      [`${search}%`]
    );

    return res.status(200).json({
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    console.error('❌ Error in searchUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
