import { RESP_TYPES } from 'redis';
import db from '../config/db.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/en.js';
dayjs.extend(relativeTime);
dayjs.locale('en');

export const users = async (req, res) => {
  const limite = req.query.limite || 15;
  const page = req.query.page || 1;
  try {
    const total_usersResult = await db.query(
      'SELECT COUNT(*) AS total_users FROM project02.users WHERE is_verified = true'
    );
    const total_users = parseInt(total_usersResult.rows[0].total_users);

    const result = await db.query(
      'SELECT id_user,username,fullname,email,img_user FROM project02.users WHERE is_verified = true LIMIT $1 OFFSET $2',
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
      `SELECT id_user, username,fullname, email, img_user,p_img,bio,created_at
       FROM project02.users
       WHERE id_user = $1 AND is_verified = true`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    userResult.rows[0].created_at = dayjs(
      userResult.rows[0].created_at
    ).fromNow();
    const result = await db.query(
      `
  SELECT
    (SELECT COUNT(*) FROM project02.comments WHERE id_user = $1) AS comments_count,
    (SELECT COUNT(*) FROM project02.posts WHERE id_user = $1) AS posts_count,
    (SELECT COUNT(*) FROM project02.likes WHERE id_user = $1) AS likes_count
  `,
      [id]
    );

    const comments_count = parseInt(result.rows[0].comments_count);
    const posts_count = parseInt(result.rows[0].posts_count);
    const likes_count = parseInt(result.rows[0].likes_count);
    // const commentResult = await db.query(
    //   `SELECT COUNT(*) AS contCom FROM project02.comments WHERE id_user = $1`,
    //   [id]
    // );
    // const comments_count = parseInt(commentResult.rows[0].contcom);

    // const postResult = await db.query(
    //   `SELECT COUNT(*) AS contPost FROM project02.posts WHERE id_user = $1`,
    //   [id]
    // );
    // const posts_count = parseInt(postResult.rows[0].contpost);

    // const likeResult = await db.query(
    //   `SELECT COUNT(*) AS contLike FROM project02.likes WHERE id_user = $1`,
    //   [id]
    // );
    // const likes_count = parseInt(likeResult.rows[0].contlike);

    return res.status(200).json({
      user: userResult.rows[0],
      stats: {
        comments_count,
        posts_count,
        likes_count,
      },
    });
  } catch (error) {
    console.log(error);
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
      `SELECT id_user, username, fullname,email, img_user
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

export const userPosts = async (req, res) => {
  const id = parseInt(req.params.id);
  const limit = req.query.limite || 15;
  const page = req.query.page || 1;

  try {
    const totalPostsResult = await db.query(
      'SELECT COUNT(*) AS total_posts FROM project02.posts WHERE id_user = $1',
      [id]
    );
    const total_posts = parseInt(totalPostsResult.rows[0].total_posts);

    const result = await db.query(
      `
 SELECT
  p.id_post,
  p.img_post,
  p.body_post,
  p.created_at AS post_created_at,
  json_agg(t.body_tag) AS tags,
  (SELECT COUNT(*) FROM project02.comments WHERE comments.id_post = p.id_post) AS comments_count,
  (SELECT COUNT(*) FROM project02.likes WHERE likes.id_post = p.id_post) AS likes_count
FROM project02.posts p
LEFT JOIN project02.post_tags pt ON pt.id_post = p.id_post
LEFT JOIN project02.tags t ON pt.id_tag = t.id_tag
WHERE p.id_user = $3
GROUP BY p.id_post, p.img_post, p.body_post, p.created_at
LIMIT $1 OFFSET $2;

      `,
      [limit, (page - 1) * limit, id]
    );

    const posts = result.rows;
    res.status(200).json({
      data: posts,
      meta: {
        current_page: page,
        last_page: Math.ceil(total_posts / limit),
        per_page: limit,
        total_posts: total_posts,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + posts.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
