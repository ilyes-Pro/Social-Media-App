import db from '../config/db.js';

export const createTag = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id);
    const body_tag = req.body.body_tag?.trim();

    // ✅ تحقق من ID
    if (isNaN(id_post)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // ✅ تحقق من وجود المنشور
    const postExists = await db.query(
      'SELECT 1 FROM project02.posts WHERE id_post = $1',
      [id_post]
    );

    if (postExists.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // ✅ تحقق من وجود tag
    if (!body_tag) {
      return res.status(400).json({ message: 'Please enter a tag' });
    }

    // ✅ تحقق هل الوسم موجود مسبقًا
    const tagShak = await db.query(
      'SELECT * FROM project02.tags WHERE body_tag = $1',
      [body_tag]
    );

    let id_tag;

    if (tagShak.rows.length > 0) {
      // إذا موجود مسبقًا
      id_tag = parseInt(tagShak.rows[0].id_tag);
    } else {
      // إذا غير موجود، أضفه
      const newTag = await db.query(
        'INSERT INTO project02.tags (body_tag) VALUES ($1) RETURNING id_tag',
        [body_tag]
      );
      id_tag = parseInt(newTag.rows[0].id_tag);
    }

    // ✅ اربط الوسم بالمنشور
    const result = await db.query(
      'INSERT INTO project02.post_tags (id_post, id_tag) VALUES ($1, $2) RETURNING *',
      [id_post, id_tag]
    );

    // ✅ بناء الرد
    return res.status(201).json({
      message: 'Tag added successfully',
      data: {
        post_tag: result.rows[0],
        tag: body_tag,
      },
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
