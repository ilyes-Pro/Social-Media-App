import e from 'express';
import db from '../config/db.js';

import { v2 as cloudinary } from 'cloudinary';
import { GetPublicId } from '../config/Cloudinary.js';

import dayjs from 'dayjs';
import 'dayjs/locale/en.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);
dayjs.locale('en');

export const createPost = async (req, res) => {
  try {
    const user = req.user.id_user;
    console.log('this is user ', user);
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
      [user, image, body_post]
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
// Another version of getAllPosts
// export const getAllPosts = async (req, res) => {
//   const limit = Math.max(parseInt(req.query.limit) || 10, 1);
//   const page = Math.max(parseInt(req.query.page) || 1, 1);
//   const offset = (page - 1) * limit;

//   try {
//     const result = await db.query(
//       `
//       SELECT
//         p.id_post,
//         p.img_post,
//         p.body_post,
//         p.created_at AS post_created_at,

//         json_build_object(
//           'id_user', u.id_user,
//           'username', u.username,
//           'fullname', u.fullname,
//           'img_user', u.img_user,
//           'email', u.email,
//           'is_verified', u.is_verified
//         ) AS author,

//         COUNT(DISTINCT c.id_comment) AS comments_count,
//         COUNT(DISTINCT l.id_like) AS likes,

//         COALESCE(
//           json_agg(DISTINCT t.body_tag) FILTER (WHERE t.body_tag IS NOT NULL),
//           '[]'
//         ) AS tags,

//         COUNT(*) OVER() AS total_posts

//       FROM project02.posts p
//       INNER JOIN project02.users u ON p.id_user = u.id_user
//       LEFT JOIN project02.comments c ON c.id_post = p.id_post
//       LEFT JOIN project02.likes l ON l.id_post = p.id_post
//       LEFT JOIN project02.post_tags pt ON pt.id_post = p.id_post
//       LEFT JOIN project02.tags t ON pt.id_tag = t.id_tag

//       GROUP BY p.id_post, u.id_user
//       ORDER BY p.created_at DESC
//       LIMIT $1 OFFSET $2
//       `,
//       [limit, offset]
//     );

//     const total_posts = result.rows[0]?.total_posts || 0;

//     const posts = result.rows.map((p) => ({
//       id_post: p.id_post,
//       body_post: p.body_post,
//       img_post: p.img_post,
//       created_at: dayjs(p.post_created_at).fromNow(),
//       author: p.author,
//       comments_count: p.comments_count,
//       like: p.likes,
//       tags: p.tags,
//     }));

//     res.status(200).json({
//       meta: {
//         current_page: page,
//         last_page: Math.ceil(total_posts / limit),
//         per_page: limit,
//         total_posts,
//         from: offset + 1,
//         to: offset + posts.length,
//       },
//       data: posts,
//     });
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

export const getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const id_user = req.user.id_user;

  try {
    // 🧮 1. احسب عدد المنشورات الكلي
    const total_Post = await db.query(
      'SELECT COUNT(*) AS total_posts FROM project02.posts'
    );
    const total_posts = parseInt(total_Post.rows[0].total_posts);

    const result = await db.query(
      `
      SELECT 
        p.id_post, 
        p.img_post, 
        p.body_post, 
        p.created_at AS post_created_at,
        u.id_user, 
        u.username, 
        u.fullname,
        u.img_user, 
        u.email, 
        u.is_verified
      FROM project02.posts p
      INNER JOIN project02.users u ON p.id_user = u.id_user
      ORDER BY p.created_at ASC
      LIMIT $1 OFFSET $2
      `,
      [limit, (page - 1) * limit]
    );

    // ⚙️ 3. استخراج الـ id_post الخاصة بالمنشورات المعروضة
    const postIds = result.rows.map((p) => p.id_post);
    if (postIds.length === 0) {
      return res.status(200).json({
        meta: {
          current_page: page,
          last_page: Math.ceil(total_posts / limit),
          per_page: limit,
          total_posts,
          from: 0,
          to: 0,
        },
        data: [],
      });
    }

    // 💬 4. جلب عدد التعليقات لكل منشور فقط في الصفحة الحالية
    const Rcomments = await db.query(
      `
      SELECT id_post, COUNT(*) AS comment_count
      FROM project02.comments
      WHERE id_post = ANY($1)
      GROUP BY id_post
      `,
      [postIds]
    );

    const Rtags = await db.query(
      `
      SELECT id_post, json_agg(body_tag) AS tags
      FROM project02.post_tags
      INNER JOIN project02.tags 
        ON project02.post_tags.id_tag = project02.tags.id_tag
      WHERE id_post = ANY($1)
      GROUP BY id_post
      `,
      [postIds]
    );

    const Rlike = await db.query(
      `
      SELECT 
  id_post,
  COUNT(*) AS likes,
  BOOL_OR(id_user = $2) AS liked
FROM project02.likes
WHERE id_post = ANY($1)
GROUP BY id_post
      `,
      [postIds, id_user]
    );
    //   EXISTS (
    //   SELECT 1
    //   FROM project02.likes l2
    //   WHERE l2.id_post = l.id_post
    //     AND l2.id_user = $2
    // ) AS liked

    // 🧩 6. دمج النتائج في كائن موحّد
    const postMap = result.rows.map((a) => ({
      id_post: a.id_post,
      body_post: a.body_post,
      img_post: a.img_post,
      created_at: dayjs(a.post_created_at).fromNow(),
      author: {
        id_user: a.id_user,
        username: a.username,
        fullname: a.fullname,
        img_user: a.img_user,
        email: a.email,
        is_verified: a.is_verified,
      },
      comments_count:
        Rcomments.rows.find((c) => c.id_post === a.id_post)?.comment_count || 0,
      tags: Rtags.rows.find((t) => t.id_post === a.id_post)?.tags || [],
      like: Rlike.rows.find((c) => c.id_post === a.id_post)?.likes || 0,
      liked: Rlike.rows.find((c) => c.id_post === a.id_post)?.liked || false,
    }));

    // 📦 7. إرسال النتيجة النهائية مع بيانات الـ pagination
    res.status(200).json({
      meta: {
        current_page: page,
        last_page: Math.ceil(total_posts / limit),
        per_page: limit,
        total_posts,
        from: (page - 1) * limit + 1,
        to: (page - 1) * limit + result.rows.length,
      },
      data: postMap,
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await db.query(
      `
      SELECT 
        p.id_post, 
        p.img_post, 
        p.body_post, 
        p.created_at AS post_created_at,
        u.id_user, 
        u.username, 
        u.fullname,
        u.img_user, 
        u.email, 
        u.is_verified
      FROM project02.posts p
      INNER JOIN project02.users u ON p.id_user = u.id_user
      WHERE id_post=$1
      ORDER BY p.created_at ASC
    
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = result.rows[0];

    const Rcomments = await db.query(
      `
      SELECT id_post, COUNT(*) AS comment_count
      FROM project02.comments
      WHERE id_post = $1
      GROUP BY id_post
      `,
      [id]
    );

    const Rtags = await db.query(
      `
      SELECT id_post, json_agg(body_tag) AS tags
      FROM project02.post_tags
      INNER JOIN project02.tags 
        ON project02.post_tags.id_tag = project02.tags.id_tag
      WHERE id_post =$1
      GROUP BY id_post
      `,
      [id]
    );

    const Rlike = await db.query(
      `
      SELECT id_post, COUNT(*) AS likes
      FROM project02.likes
      WHERE id_post = $1
      GROUP BY id_post
      `,
      [id]
    );

    const postMap = {
      id_post: post.id_post,
      body_post: post.body_post,
      img_post: post.img_post,
      created_at: dayjs(post.post_created_at).fromNow(),
      author: {
        id_user: post.id_user,
        username: post.username,
        fullname: post.fullname,
        img_user: post.img_user,
        email: post.email,
        is_verified: post.is_verified,
      },
      comments_count:
        Rcomments.rows.find((c) => c.id_post === post.id_post)?.comment_count ||
        0,
      tags: Rtags.rows.find((t) => t.id_post === post.id_post)?.tags || [],
      like: Rlike.rows.find((c) => c.id_post === post.id_post)?.likes || 0,
    };

    res.status(200).json({
      data: postMap,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id_post);
    const user = req.user;

    const text = req.body.body_post;
    const image = req.file?.path;

    const postOwner = await db.query(
      'SELECT id_user, img_post FROM project02.posts WHERE id_post = $1',
      [id_post]
    );

    if (!postOwner.rows.length) {
      if (image) {
        const publicId = GetPublicId(image);
        cloudinary.uploader.destroy(publicId);
      }
      return res.status(404).json({ message: 'post not found' });
    }

    if (postOwner.rows[0].id_user !== user.id_user) {
      if (image) {
        const publicId = GetPublicId(image);
        cloudinary.uploader.destroy(publicId);
      }
      return res
        .status(403)
        .json({ message: 'not authorized to edit this post' });
    }

    if (!text && !image) {
      if (image) {
        const publicId = GetPublicId(image);
        await cloudinary.uploader.destroy(publicId);
      }
      return res.status(400).json({ message: 'enter text or post' });
    }

    const reset = await db.query(
      'UPDATE project02.posts SET  body_post = COALESCE($1, body_post), img_post = COALESCE($2, img_post) WHERE id_post=$3 RETURNING *',
      [text, image, id_post]
    );

    if (image && reset.rows[0].img_post) {
      const publicId = GetPublicId(postOwner.rows[0].img_post);
      await cloudinary.uploader.destroy(publicId);
    }
    res.status(200).json({
      message: 'post updated successfully',
      data: reset.rows[0],
    });
  } catch (err) {
    if (req.file?.path) {
      const failedPublicId = GetPublicId(req.file.path);
      await cloudinary.uploader.destroy(failedPublicId);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id_post = parseInt(req.params.id_post);

    const postOwner = await db.query(
      'SELECT id_user, img_post FROM project02.posts WHERE id_post = $1',
      [id_post]
    );

    if (!postOwner.rows.length) {
      return res.status(404).json({ message: 'post not found' });
    }

    const reset = await db.query(
      'DELETE FROM project02.posts WHERE id_post = $1 RETURNING *',
      [id_post]
    );
    if (postOwner.rows[0].img_post) {
      const publicId = GetPublicId(postOwner.rows[0].img_post);
      await cloudinary.uploader.destroy(publicId);
    }
    res.status(200).json({
      message: 'post deleted successfully',
      data: reset.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Another version of deletePost

// export const deletePost = async (req, res) => {
//   try {
//     const id_post = parseInt(req.params.id_post);

//     const post = await db.query(
//       'SELECT id_user, img_post FROM project02.posts WHERE id_post = $1',
//       [id_post]
//     );

//     if (!post.rows.length) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     const deleted = await db.query(
//       'DELETE FROM project02.posts WHERE id_post = $1 RETURNING *',
//       [id_post]
//     );

//     if (post.rows[0].img_post) {
//       try {
//         const publicId = GetPublicId(post.rows[0].img_post);
//         await cloudinary.uploader.destroy(publicId);
//       } catch (err) {
//         console.warn('Cloudinary deletion failed', err);
//       }
//     }

//     res.status(200).json({
//       message: 'Post deleted successfully',
//       data: deleted.rows[0],
//     });
//   } catch (err) {
//     console.error('Delete post error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
