import db from '../config/db.js';

export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { body_post } = req.body;
    const image = req.file?.path;

    if (!body_post || !image) {
      return res
        .status(400)
        .json({ error: 'Enter image and body of the post' });
    }

    const result = await db.query(
      `INSERT INTO project02.posts (id_user, img_post, body_post)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user.id_user, image, body_post]
    );

    return res.status(201).json({
      message: 'Post created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error in createPost:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id_post, 
        p.img_post, 
        p.body_post, 
        p.created_at AS post_created_at,
        u.id_user, 
        u.username, 
        u.img_user, 
        u.email, 
        u.is_verified
      FROM project02.posts p
      INNER JOIN project02.users u ON p.id_user = u.id_user
      ORDER BY p.created_at DESC
    `);

    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
