import db from '../config/db.js';

// export const friendReq = async (req, res) => {
//   try {
//     const id_friend = parseInt(req.params.id);
//     const id_user = req.user.id_user;

//     // 1️⃣ تحقق من صحة ID
//     if (isNaN(id_friend)) {
//       return res.status(400).json({ message: 'Invalid friend ID' });
//     }

//     // 2️⃣ منع إرسال طلب لنفسك
//     if (id_user === id_friend) {
//       return res
//         .status(400)
//         .json({ message: 'You cannot send a friend request to yourself' });
//     }

//     // 3️⃣ تحقق من وجود المستخدم الهدف
//     const friendExists = await db.query(
//       'SELECT 1 FROM project02.users WHERE id_user = $1',
//       [id_friend]
//     );
//     if (friendExists.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // 4️⃣ تحقق من وجود طلب عكسي (الطرف الآخر أرسل لك طلبًا)
//     const reverseFriendship = await db.query(
//       'SELECT * FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
//       [id_friend, id_user]
//     );

//     if (reverseFriendship.rows.length > 0) {
//       // قبول الطلب العكسي
//       await db.query(
//         'UPDATE project02.friendships SET status = TRUE WHERE id_user = $1 AND id_friend = $2',
//         [id_friend, id_user]
//       );

//       // إضافة صف عكسي لجعل العلاقة ثنائية الاتجاه (اختياري)
//       await db.query(
//         'INSERT INTO project02.friendships (id_user, id_friend, status) VALUES ($1, $2, TRUE) ON CONFLICT DO NOTHING',
//         [id_user, id_friend]
//       );

//       return res.status(200).json({ message: 'Friend request status ✅' });
//     }

//     // 5️⃣ تحقق من وجود طلب سابق منك
//     const existingFriendship = await db.query(
//       'SELECT * FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
//       [id_user, id_friend]
//     );

//     if (existingFriendship.rows.length > 0) {
//       const friendship = existingFriendship.rows[0];

//       if (friendship.status) {
//         // حذف الصداقة القائمة
//         await db.query(
//           'DELETE FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
//           [id_user, id_friend]
//         );
//         await db.query(
//           'DELETE FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
//           [id_friend, id_user]
//         );
//         return res.status(200).json({ message: 'Friend removed ❌' });
//       } else {
//         // إلغاء طلب الصداقة المعلق
//         await db.query(
//           'DELETE FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
//           [id_user, id_friend]
//         );
//         return res.status(200).json({ message: 'Friend request canceled 🚫' });
//       }
//     }

//     // 6️⃣ إرسال طلب صداقة جديد
//     await db.query(
//       'INSERT INTO project02.friendships (id_user, id_friend, status) VALUES ($1, $2, FALSE)',
//       [id_user, id_friend]
//     );

//     return res.status(201).json({ message: 'Friend request sent ✅' });
//   } catch (error) {
//     console.error('Error in friendReq:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const SendAcceptRequerst = async (req, res) => {
  try {
    const id_friend = parseInt(req.params.id);
    const id_user = req.user.id_user;

    // 1️⃣ تحقق من صحة ID
    if (isNaN(id_friend)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }

    // 2️⃣ منع إرسال طلب لنفسك
    if (id_user === id_friend) {
      return res
        .status(400)
        .json({ message: 'You cannot send a friend request to yourself' });
    }

    // 3️⃣ تحقق من وجود المستخدم الهدف
    const friendExists = await db.query(
      'SELECT 1 FROM project02.users WHERE id_user = $1',
      [id_friend]
    );
    if (friendExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4️⃣ تحقق من وجود طلب عكسي (الطرف الآخر أرسل لك طلبًا)
    const reverseFriendship = await db.query(
      'SELECT * FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
      [id_friend, id_user]
    );

    if (reverseFriendship.rows.length > 0) {
      // قبول الطلب العكسي
      await db.query(
        'UPDATE project02.friendships SET status = TRUE WHERE id_user = $1 AND id_friend = $2',
        [id_friend, id_user]
      );

      // إضافة صف عكسي لجعل العلاقة ثنائية الاتجاه (اختياري)
      await db.query(
        'INSERT INTO project02.friendships (id_user, id_friend, status) VALUES ($1, $2, TRUE) ON CONFLICT DO NOTHING',
        [id_user, id_friend]
      );

      return res
        .status(200)
        .json({ message: 'Friendship request accepted ✅' });
    }

    // 5️⃣ تحقق من وجود طلب سابق منك
    const existingFriendship = await db.query(
      'SELECT * FROM project02.friendships WHERE id_user = $1 AND id_friend = $2',
      [id_user, id_friend]
    );

    if (existingFriendship.rows.length > 0) {
      return res.status(400).json({ error: 'I have sent a friend request' });
    }

    // 6️⃣ إرسال طلب صداقة جديد
    await db.query(
      'INSERT INTO project02.friendships (id_user, id_friend, status) VALUES ($1, $2, FALSE)',
      [id_user, id_friend]
    );

    return res.status(201).json({ message: 'Friendship request sent ✅' });
  } catch (error) {
    console.error('Error in friendReq:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const Cancel_reauest_sender_receiver = async (req, res) => {
  try {
    const id_friend = parseInt(req.params.id);
    const id_user = req.user.id_user;

    if (isNaN(id_friend)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }

    if (id_user === id_friend) {
      return res
        .status(400)
        .json({ message: 'You cannot send a friend request to yourself' });
    }

    const friendExists = await db.query(
      'SELECT 1 FROM project02.users WHERE id_user = $1',
      [id_friend]
    );
    if (friendExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFriendship = await db.query(
      'SELECT * FROM project02.friendships WHERE ((id_user = $1 AND id_friend = $2) OR (id_user = $2 AND id_friend =$1 )) AND status = FALSE',
      [id_user, id_friend]
    );

    if (existingFriendship.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'There is no pending request to cancel' });
    }

    const result = await db.query(
      'DELETE FROM project02.friendships WHERE ((id_user = $1 AND id_friend = $2) OR (id_user = $2 AND id_friend = $1)) AND status = FALSE RETURNING *',
      [id_user, id_friend]
    );

    return res.status(200).json({
      message: 'Friend request canceled successfully',
      deleted: result.rows,
    });
  } catch (error) {
    console.error('Error in Cancel_reauest_sender_receiver:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const Unfriend = async (req, res) => {
  try {
    const id_friend = parseInt(req.params.id);
    const id_user = req.user.id_user;

    if (isNaN(id_friend)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }

    if (id_user === id_friend) {
      return res.status(400).json({ message: 'You cannot unfriend yourself' });
    }

    const friendExists = await db.query(
      'SELECT 1 FROM project02.users WHERE id_user = $1',
      [id_friend]
    );
    if (friendExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFriendship = await db.query(
      'SELECT * FROM project02.friendships WHERE ((id_user = $1 AND id_friend = $2) OR (id_user =$2  AND id_friend =$1 )) AND status = TRUE',
      [id_user, id_friend]
    );

    if (existingFriendship.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'There is no active friendship to remove' });
    }

    await db.query(
      'DELETE FROM project02.friendships WHERE ((id_user = $1 AND id_friend = $2 ) OR (id_user = $2 AND id_friend = $1 )) AND status = TRUE',
      [id_user, id_friend]
    );

    return res.status(200).json({ message: 'Friend removed successfully ❌' });
  } catch (error) {
    console.error('Error in Unfriend:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
