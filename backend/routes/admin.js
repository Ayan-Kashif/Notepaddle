// const express = require('express');
// const router = express.Router();
// const Admin = require('../models/Admin');
// const User = require('../models/User');
// const Note = require('../models/Note');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const adminAuth = require('../middleware/adminAuth');

// // Admin login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });

//   if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//   res.json({ token });
// });

// // Get all users and note count
// router.get('/users', adminAuth, async (req, res) => {
//   const users = await User.find({});
//   console.log(users)
//   const usersWithNoteCount = await Promise.all(users.map(async user => {
//     const noteCount = await Note.countDocuments({ userId: user._id });
//     return { ...user.toObject(), noteCount };
//   }));
//   res.json(usersWithNoteCount);
// });

// // Ban/unban user
// // router.patch('/users/:id/ban', adminAuth, async (req, res) => {
// //   const user = await User.findById(req.params.id);
// //   if (!user) return res.status(404).json({ message: 'User not found' });

// //   user.isBanned = !user.isBanned;
// //   await user.save();
// //   res.json({ message: `User has been ${user.isBanned ? 'banned' : 'unbanned'}` });
// // });

// router.patch('/users/:id/ban', adminAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const wasBanned = user.isBanned;
//     user.isBanned = !user.isBanned;
//     await user.save();

//     const Note = require('../models/Note'); // adjust path as necessary

//     if (user.isBanned) {
//       // Remove user from all collaborators
//       await Note.updateMany(
//         { 'collaborators.userId': user._id },
//         { $pull: { collaborators: { userId: user._id } } }
//       );
//     } else {
//       // Re-add user as collaborator where they were previously removed (optional)
//       // If you want full re-add support, you'd need to store history separately
//       // This block only logs a warning
//       console.warn(
//         `User ${user.email} unbanned. Collaborator access not restored (no history tracking).`
//       );
//     }

//     res.json({
//       message: `User has been ${user.isBanned ? 'banned and removed from collaborators' : 'unbanned'}`,
//     });

//   } catch (err) {
//     console.error('Ban/unban error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Change admin password
// router.patch('/change-password', adminAuth, async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   const isMatch = await bcrypt.compare(currentPassword, req.admin.password);
//   if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

//   const salt = await bcrypt.genSalt(10);
//   req.admin.password = await bcrypt.hash(newPassword, salt);
//   await req.admin.save();

//   res.json({ message: 'Password updated successfully' });
// });

// module.exports = router;



// //Stats

// // routes/admin.js
// // router.get('/stats', adminAuth, async (req, res) => {
// //   try {
// //     const totalUsers = await User.countDocuments();
// //     const bannedUsers = await User.countDocuments({ isBanned: true });
// //     const pendingUsers = await User.countDocuments({ isVerified: false });
// //     const activeUsers = totalUsers - bannedUsers - pendingUsers;

// //     const totalNotes = await Note.countDocuments();
// //     const privateNotes = await Note.countDocuments({ isPrivate: true });
// //     const sharedNotes = await Note.countDocuments({ isShared: true });
// //     const publicNotes = totalNotes - privateNotes - sharedNotes;

// //     const notesPerMonth = await Note.aggregate([
// //       {
// //         $group: {
// //           _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
// //           count: { $sum: 1 },
// //         }
// //       },
// //       { $sort: { _id: 1 } }
// //     ]);

// //     const usersPerMonth = await User.aggregate([
// //       {
// //         $group: {
// //           _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
// //           count: { $sum: 1 },
// //         }
// //       },
// //       { $sort: { _id: 1 } }
// //     ]);

// //     res.json({
// //       totalUsers,
// //       activeUsers,
// //       pendingUsers,
// //       bannedUsers,
// //       totalNotes,
// //       privateNotes,
// //       sharedNotes,
// //       publicNotes,
// //       notesPerMonth,
// //       usersPerMonth,
// //       averageNotesPerUser: totalUsers ? (totalNotes / totalUsers).toFixed(2) : 0
// //     });
// //   } catch (error) {
// //     console.error('Stats Error:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });



// // /api/admin/stats (already mentioned earlier, ensure it's implemented like this)
// // GET /api/admin/stats
// router.get('/stats', adminAuth, async (req, res) => {
//   try {
//     const [totalUsers, bannedUsers, pendingUsers, activeUsers] = await Promise.all([
//       User.countDocuments(),
//       User.countDocuments({ isBanned: true }),
//       User.countDocuments({ isVerified: false }),
//       User.countDocuments({ isBanned: false, isVerified: true }),
//     ]);

//     const [totalNotes, privateNotes, sharedNotes] = await Promise.all([
//       Note.countDocuments(),
//       Note.countDocuments({ isPrivate: true }),
//       Note.countDocuments({ isShared: true }),
//     ]);

//     // Notes created per month (last 6 months)
//     const notesPerMonth = await Note.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) }
//         }
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     // Users registered per month (last 6 months)
//     const usersPerMonth = await User.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) }
//         }
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     const notesInsights = {};

// const avgNotes = totalNotes / totalUsers;
// notesInsights.avgNotesPerUser = Number(avgNotes.toFixed(2));

// const topUser = await User.aggregate([
//   {
//     $lookup: {
//       from: 'notes',
//       localField: '_id',
//       foreignField: 'user',
//       as: 'notes',
//     },
//   },
//   {
//     $project: {
//       name: 1,
//       email: 1,
//       noteCount: { $size: '$notes' },
//     },
//   },
//   { $sort: { noteCount: -1 } },
//   { $limit: 1 },
// ]);

// notesInsights.mostNotesBy = topUser[0] || {};


//     res.json({
//       totalUsers,
//       activeUsers,
//       bannedUsers,
//       pendingUsers,
//       totalNotes,
//       privateNotes,
//       sharedNotes,
//       notesPerMonth,
//       usersPerMonth,
//       notesInsights,
//     });
//   } catch (err) {
//     console.error('Admin stats error:', err);
//     res.status(500).json({ error: 'Failed to fetch admin stats' });
//   }
// });



// //Pending users

// router.get('/pending-users', adminAuth, async (req, res) => {
//   const users = await User.find({ isVerified: false });
//   res.json(users);
// });


// //Announcement!

// let ANNOUNCEMENT = ''; // In-memory store, or use DB

// router.post('/announcement', adminAuth, (req, res) => {
//   let { message } = req.body;

//   // Trim whitespace and check if it's empty
//   if (!message || message.trim() === '') {
//     ANNOUNCEMENT = null; 
//     return res.json({ message: 'Announcement cleared' });
//   }

//   ANNOUNCEMENT = message.trim();
//   res.json({ message: 'Announcement updated' });
// });


// router.get('/announcement', (req, res) => {
//   res.json({ message: ANNOUNCEMENT });
// });


// //Verify pending users by admin
// router.patch('/users/:id/verify', adminAuth, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   user.isVerified = true;
//   await user.save();

//   res.json({ message: 'User verified' });
// });
// router.get('/test', (req, res) => {
//   res.send('Admin routes working!');
// });

// //Export Users
// router.get('/export/users', adminAuth, async (req, res) => {
//   const users = await User.find().lean();
//   const csv = users.map(u => `${u.name},${u.email},${u.isBanned ? 'Banned' : 'Active'}`).join('\n');
//   res.setHeader('Content-Type', 'text/csv');
//   res.send('Name,Email,Status\n' + csv);
// });



const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.send('Admin test route is working');
});

module.exports = router;

