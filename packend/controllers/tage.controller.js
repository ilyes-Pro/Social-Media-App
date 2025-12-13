import db from '../config/db.js';

// export const createTag = async (req, res) => {
//   try {
//     const id_post = parseInt(req.params.id);
//     const body_tags = req.body.body_tag?.trim();

//     // ✅ تحقق من ID
//     if (isNaN(id_post)) {
//       return res.status(400).json({ message: 'Invalid post ID' });
//     }

//     // ✅ تحقق من وجود المنشور
//     const postExists = await db.query(
//       'SELECT 1 FROM project02.posts WHERE id_post = $1',
//       [id_post]
//     );

//     if (postExists.rows.length === 0) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const deleteOldTags = await db.query(
//       'DELETE FROM project02.post_tags WHERE id_post = $1 RETURNING *',
//       [id_post]
//     );
//     // ✅ تحقق من وجود tag
//     if (body_tags.length === 0) {
//       return res
//         .status(400)
//         .json({ data: deleteOldTags.rows, message: 'Tag is required' });
//     }

//     for (const body_tag of body_tags) {
//       // ✅ تحقق هل الوسم موجود مسبقًا
//       const tagShak = await db.query(
//         'SELECT * FROM project02.tags WHERE body_tag = $1',
//         [body_tag]
//       );

//       let id_tag;

//       if (tagShak.rows.length > 0) {
//         // إذا موجود مسبقًا
//         id_tag = parseInt(tagShak.rows[0].id_tag);
//         console.log('this is the fuke' + id_tag);
//       } else {
//         // إذا غير موجود، أضفه
//         const newTag = await db.query(
//           'INSERT INTO project02.tags (body_tag) VALUES ($1) RETURNING id_tag',
//           [body_tag]
//         );
//         id_tag = parseInt(newTag.rows[0].id_tag);
//       }

//       // ✅ اربط الوسم بالمنشور
//       const result = await db.query(
//         'INSERT INTO project02.post_tags (id_post, id_tag) VALUES ($1, $2) RETURNING *',
//         [id_post, id_tag]
//       );
//     }

//     results = await db.query(
//       'SELECT pt.*,  JSON_AGG(t.body_tag) FROM project02.post_tags pt JOIN project02.tags t ON pt.id_tag = t.id_tag WHERE pt.id_post = $1 GROUP BY pt.id_post, pt.id_tag',
//       [id_post]
//     );
//     // ✅ بناء الرد
//     return res.status(201).json({
//       message: 'Tag added successfully',
//       data: {
//         post_tag: results.rows,
//       },
//     });
//   } catch (error) {
//     console.error('Error creating tag:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const createTag = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id);
    const body_tags = req.body.body_tag; // يجب أن تكون مصفوفة

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

    // ✅ حذف الوسوم القديمة
    const deleteOldTags = await db.query(
      'DELETE FROM project02.post_tags WHERE id_post = $1 RETURNING *',
      [id_post]
    );

    // ✅ تحقق من الوسوم
    if (!Array.isArray(body_tags) || body_tags.length === 0) {
      return res.status(200).json({
        data: deleteOldTags.rows,
        message: 'No tags provided, old tags deleted',
      });
    }

    for (let body_tag of body_tags) {
      body_tag = body_tag.trim().toLowerCase();
      if (!body_tag) continue;

      // تحقق هل الوسم موجود
      const tagShak = await db.query(
        'SELECT id_tag FROM project02.tags WHERE body_tag = $1',
        [body_tag]
      );

      let id_tag;
      if (tagShak.rows.length > 0) {
        id_tag = tagShak.rows[0].id_tag;
      } else {
        const newTag = await db.query(
          'INSERT INTO project02.tags (body_tag) VALUES ($1) RETURNING id_tag',
          [body_tag]
        );
        id_tag = newTag.rows[0].id_tag;
      }

      // ✅ اربط الوسم بالمنشور
      await db.query(
        `INSERT INTO project02.post_tags (id_post, id_tag)
         VALUES ($1, $2)
         ON CONFLICT (id_post, id_tag) DO NOTHING`,
        [id_post, id_tag]
      );
    }

    // ✅ اجلب الوسوم الجديدة في مصفوفة JSON
    const results = await db.query(
      `SELECT pt.id_post, JSON_AGG(t.body_tag) AS tags
       FROM project02.post_tags pt
       JOIN project02.tags t ON pt.id_tag = t.id_tag
       WHERE pt.id_post = $1
       GROUP BY pt.id_post`,
      [id_post]
    );

    return res.status(201).json({
      message: 'Tags updated successfully',
      data: results.rows[0],
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// export const getPostByTagId = async (req, res) => {
//   try {
//     const id_tag = parseInt(req.params.id);
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     if (isNaN(id_tag)) {
//       return res.status(400).json({ message: 'Invalid tag ID' });
//     }

//     // ✅ تحقق من وجود المنشور
//     const postExists = await db.query(
//       'SELECT 1 FROM project02.tags WHERE id_tag = $1',
//       [id_tag]
//     );
//     if (postExists.rows.length === 0) {
//       return res.status(404).json({ message: 'Tag not found' });
//     }

//     const results = await db.query(
//       `SELECT p.*, t.body_tag , u.username, u.email, u.img_user, u.is_verified, p.created_at AS post_created_at,u.id_user, c.count(*) AS comment_count, l.count(*) AS likes
//        FROM project02.post_tags pt
//        JOIN project02.posts p ON pt.id_post = p.id_post
//        JOIN project02.tags t ON pt.id_tag = t.id_tag
//        JOIN project02.users u ON p.id_user = u.id_user
//        JOIN project02.comments c ON p.id_post = c.id_post
//        JOIN project02.likes l ON p.id_post = l.id_post
//        WHERE pt.id_tag = $1  LIMIT $2 OFFSET $3`,
//       [id_tag, limit, offset]
//     );

//     const postMap = results.rows.map((a) => ({
//       id_post: a.id_post,
//       body_post: a.body_post,
//       img_post: a.img_post,
//       created_at: dayjs(a.post_created_at).fromNow(),
//       author: {
//         id_user: a.id_user,
//         username: a.username,
//         img_user: a.img_user,
//         email: a.email,
//         is_verified: a.is_verified,
//       },
//       comments_count:
//         Rcomments.rows.find((c) => c.id_post === a.id_post)?.comment_count || 0,

//       like: Rlike.rows.find((c) => c.id_post === a.id_post)?.likes || 0,
//     }));

//     // 📦 7. إرسال النتيجة النهائية مع بيانات الـ pagination
//     return res.status(200).json({
//       meta: {
//         current_page: page,
//         last_page: Math.ceil(total_posts / limit),
//         per_page: limit,
//         total_posts,
//         from: (page - 1) * limit + 1,
//         to: (page - 1) * limit + result.rows.length,
//       },
//       data: postMap,
//     });
//   } catch (error) {
//     console.error('Error fetching tags:', error);
//     return res.status(500).json({ error: ' server error' });
//   }
// };

export const getPostByTagId = async (req, res) => {
  try {
    const id_tag = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (isNaN(id_tag)) {
      return res.status(400).json({ message: 'Invalid tag ID' });
    }

    // ✅ تحقق من وجود الوسم
    const tagExists = await db.query(
      'SELECT 1 FROM project02.tags WHERE id_tag = $1',
      [id_tag]
    );
    if (tagExists.rows.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // ✅ العدد الكلي للمنشورات
    const totalResult = await db.query(
      `SELECT COUNT(DISTINCT p.id_post) AS total
       FROM project02.post_tags pt
       JOIN project02.posts p ON pt.id_post = p.id_post
       WHERE pt.id_tag = $1`,
      [id_tag]
    );
    const total_posts = parseInt(totalResult.rows[0].total);

    // ✅ جلب المنشورات
    const results = await db.query(
      `SELECT 
        p.id_post,
        p.body_post,
        p.img_post,
        p.created_at AS post_created_at,
        u.id_user, u.username,u.fullname, u.email, u.img_user, u.is_verified,
        t.body_tag,
        (SELECT COUNT(*) FROM project02.comments c WHERE c.id_post = p.id_post) AS comment_count,
        (SELECT COUNT(*) FROM project02.likes l WHERE l.id_post = p.id_post) AS like_count
      FROM project02.post_tags pt
      JOIN project02.posts p ON pt.id_post = p.id_post
      JOIN project02.tags t ON pt.id_tag = t.id_tag
      JOIN project02.users u ON p.id_user = u.id_user
      WHERE pt.id_tag = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3`,
      [id_tag, limit, offset]
    );

    const data = results.rows.map((a) => ({
      id_post: a.id_post,
      body_post: a.body_post,
      img_post: a.img_post,
      created_at: a.post_created_at,
      author: {
        id_user: a.id_user,
        username: a.username,
        fullname:a.fullname,
        img_user: a.img_user,
        email: a.email,
        is_verified: a.is_verified,
      },
      tag: a.body_tag,
      comments_count: a.comment_count,
      like_count: a.like_count,
    }));

    return res.status(200).json({
      meta: {
        current_page: page,
        last_page: Math.ceil(total_posts / limit),
        per_page: limit,
        total_posts,
        from: offset + 1,
        to: offset + data.length,
      },
      data,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
