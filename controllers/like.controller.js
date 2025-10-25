import db from '../config/db.js';

export const likePost = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id);
    const user = req.user;
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
    // delete like if exists
    const likeExists = await db.query(
      'SELECT * FROM project02.likes WHERE id_post = $1 AND id_user = $2',
      [id_post, user.id_user]
    );
    if (likeExists.rows.length > 0) {
      await db.query(
        'DELETE FROM project02.likes WHERE id_post = $1 AND id_user = $2',
        [id_post, user.id_user]
      );

      return res
        .status(200)
        .json({
          message: 'Post unliked successfully',
          deslike: postExists.rows[0],
        });
    }

    //add like
    const result = await db.query(
      'INSERT INTO project02.likes (id_post, id_user) VALUES ($1, $2) RETURNING *',
      [id_post, user.id_user]
    );
    return res.status(201).json({
      message: 'Post liked successfully',
      like: result.rows[0],
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const showUsersLikesPost = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id);
    if (isNaN(id_post)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const postExists = await db.query(
      'SELECT * FROM project02.posts WHERE id_post = $1',
      [id_post]
    );

    if (postExists.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userLikes = await db.query(
      `SELECT u.id_user, u.username, u.email, u.img_user
       FROM project02.likes l
       JOIN project02.users u ON l.id_user = u.id_user
       WHERE l.id_post = $1
       ORDER BY l.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id_post, limit, offset]
    );

    const totalLikesResult = await db.query(
      'SELECT COUNT(*) AS total FROM project02.likes WHERE id_post = $1',
      [id_post]
    );
    const total_likes = parseInt(totalLikesResult.rows[0].total);
    const meta = {
      current_page: page,
      last_page: Math.ceil(total_likes / limit),
      per_page: limit,
      total_likes,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + userLikes.rows.length,
    };
    res.status(200).json({
      id_post,
      meta,
      likes: userLikes.rows,
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
