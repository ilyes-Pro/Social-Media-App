import db from '../config/db.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);
dayjs.locale('en');

export const getCommentsByPostId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const postExists = await db.query(
      'SELECT * FROM project02.posts WHERE id_post = $1',
      [id]
    );
    if (postExists.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const totalResult = await db.query(
      'SELECT COUNT(*) FROM project02.comments WHERE id_post = $1',
      [id]
    );
    const total_comments = parseInt(totalResult.rows[0].count);
    const result = await db.query(
      `SELECT 
         c.id_comment, c.body_comment, c.created_at,
         u.id_user, u.username,u.fullname, u.email, u.img_user, u.is_verified
       FROM project02.comments c
       JOIN project02.users u ON c.id_user = u.id_user
       WHERE c.id_post = $1
       ORDER BY c.created_at ASC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const commentsMap = result.rows.map((a) => ({
      id_comment: a.id_comment,
      body_comment: a.body_comment,

      author: {
        id_user: a.id_user,
        username: a.username,
        fullname: a.fullname,
        img_user: a.img_user,
        email: a.email,
        is_verified: a.is_verified,
      },
      created_at: dayjs(a.created_at).fromNow(),
    }));

    const meta = {
      current_page: page,
      last_page: Math.ceil(total_comments / limit),
      per_page: limit,
      total_comments,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + result.rows.length,
    };
    res.status(200).json({ id_post: id, comments: commentsMap, meta });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id);
    if (isNaN(id_post)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const postExists = await db.query(
      'SELECT * FROM project02.posts WHERE id_post = $1',
      [id_post]
    );

    if (postExists.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const { body_comment } = req.body;
    const user = req.user;
    if (!body_comment) {
      return res.status(400).json({ message: 'Please enter the comment body' });
    }

    const reset = await db.query(
      'INSERT INTO project02.comments (body_comment,id_post,id_user) VALUES ($1,$2,$3) RETURNING *',
      [body_comment, id_post, user.id_user]
    );

    const author = await db.query(
      'SELECT id_user ,username,fullname,email,img_user FROM project02.users WHERE id_user = $1',
      [user.id_user]
    );
    const newComment = {
      id_comment: reset.rows[0].id_comment,
      body_comment: reset.rows[0].body_comment,
      created_at: dayjs(reset.rows[0].created_at).fromNow(),
      author: author.rows[0],
    };
    return res.status(201).json({
      message: 'Comment added successfully',
      id_post,
      comment: newComment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
