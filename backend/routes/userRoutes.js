
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const { sendVerificationEmail } = require('../utils/sendEmail');
require('dotenv').config();
const authenticate = require('../middleware/authenticate')
const upload = require('../middleware/upload');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

const Note = require('../models/Note')



//NOTES handling


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user;
        next();
    });
};




// Enhanced note routes
router.post('/notes', authenticateToken, async (req, res, next) => {
    try {
        console.log(req.body)
        const requiredFields = ['title', 'content'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        const noteData = {
            ...req.body,
            userId: req.user.id,
            collaborators: Array.isArray(req.body.collaborators)
                ? req.body.collaborators
                : [],
        };

        const note = new Note(noteData);

        console.log(note)

        const validationError = note.validateSync();
        if (validationError) {
            throw validationError;
        }

        await note.save();

        res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
});

/


router.put('/notes/:id', authenticateToken, async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);

        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'title',
            'content',
            'contentType',
            'category',
            'tags',
            'isPinned',
            'isFavorite',
            'isPrivate',
            'isShared',
            'isDeleted',
            'password',
            'passwordHint',
            'version',
            'sharedWith',
            'collaborators',
            'lastEditedBy',
            'updatedAt'
        ];

        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        console.log(isValidOperation)
        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                error: 'Invalid updates!'
            });
        }

        if (req.body.isPrivate) {
            console.log(req.body.isPrivate)
            req.body.isShared = false;
            req.body.shareId = null;
            req.body.sharePermissions = null;
        }

        const updateData = {
            ...req.body,
            updatedAt: Date.now(),
        };

        // 👉 Handle deletedAt based on isDeleted
        if ('isDeleted' in req.body) {
            if (req.body.isDeleted === true) {
                updateData.deletedAt = new Date();
            } else {
                updateData.deletedAt = null;
            }
        }


        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { userId: req.user.id }, // Owner
                    {
                        collaborators: {
                            $elemMatch: { userId: req.user.id, permission: 'edit' }
                        }
                    }
                ]
            },
            updateData,
            { new: true, runValidators: true }
        );


        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            });
        }

        console.log('Note: ', note)

        res.json({
            success: true,
            data: note
        });

    } catch (error) {
        console.error('Error updating note:', error);
        next(error);
    }
});






router.get('/shared/:shareId', async (req, res) => {
    const { shareId } = req.params;
    console.log(shareId)
    const note = await Note.findOne({
        _id: new mongoose.Types.ObjectId(shareId),
        isShared: true
    });

    if (!note) {
        return res.status(404).json({ error: 'Note not found or not shared.' });
    }

    res.json({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        contentType: note.contentType,
        tags: note.tags,
        isPinned: note.isPinned,
        isFavorite: note.isFavorite,
        isShared: note.isShared,
        vrsion: note.version,
        isPrivate: note.isPrivate,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
    });
});











router.get('/notes', authenticateToken, async (req, res) => {
    try {
        // The user ID is automatically available from the authenticated token
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//Get user

router.get('/get-user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});




// Handling the user data


// Get user data
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, bio } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, bio },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Upload profile image
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: req.file.path },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete account


router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's notes
    await Note.deleteMany({ userId });

    // Remove user from collaborators in all notes
    await Note.updateMany(
      { 'collaborators.userId': userId },
      { $pull: { collaborators: { userId } } }
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});



//delete note
// DELETE /api/users/notes/:id/permanent
router.delete('/notes/:id/permanent', authenticateToken, async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            });
        }

        res.json({
            success: true,
            message: 'Note permanently deleted'
        });
    } catch (error) {
        next(error);
    }
});

//Empty bin

router.delete('/notes/bin', authenticateToken, async (req, res) => {
    try {
        const result = await Note.deleteMany({
            userId: req.user.id,
            isDeleted: true
        });

        res.json({
            success: true,
            message: 'Bin emptied successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error emptying bin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to empty bin'
        });
    }
});


// Export data
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        const notes = await Note.find({ userId: userId });


        const exportData = {
            user,
            notes,

            exportedAt: new Date()
        };

        const exportsDir = path.resolve(__dirname, '../exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        const fileName = `export-${user.username || user._id}.txt`;
        const filePath = path.join(exportsDir, fileName);

        // Build a plain text version of the export data
        let fileContent = `User Info:\n`;
        fileContent += `Name: ${user.name}\n`;
        fileContent += `Email: ${user.email}\n\n`;



        fileContent += `Notes:\n`;
        notes.forEach((note, index) => {
            fileContent += `\nNote ${index + 1}:\n`;
            fileContent += `Title: ${note.title}\n`;
            fileContent += `Content: ${note.content}\n`;
            fileContent += `Tags: ${note.tags.join(', ')}\n`;
            fileContent += `Category: ${note.category}\n`;
            fileContent += `---\n`;
        });

        // Write as .txt
        fs.writeFileSync(filePath, fileContent, 'utf8');

        // Send file for download
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending .txt file:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Failed to download .txt file' });
                }
            }
        });


    } catch (err) {
        console.error('Export route error:', err);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Unexpected server error.' });
        }
    }
});











router.post('/notes/:id/collaborators', authenticateToken, async (req, res) => {
    const { email, permission } = req.body;

    if (!email || !permission) {
        return res.status(400).json({ error: 'Email and permission are required.' });
    }

    if (!['view', 'edit'].includes(permission)) {
        return res.status(400).json({ error: 'Permission must be "view" or "edit".' });
    }

    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found or you are not the owner.' });
        }

        const userToAdd = await User.findOne({ email });

        if (!userToAdd) {
            return res.status(404).json({ error: 'User with this email does not exist.' });
        }

        // ✅ Banned user check
        if (userToAdd.isBanned) {
            return res.status(403).json({ error: 'This user is banned and cannot be added as a collaborator.' });
        }

        const alreadyCollaborator = note.collaborators.some(
            (collab) => collab.userId.toString() === userToAdd._id.toString()
        );

        if (alreadyCollaborator) {
            return res.status(400).json({ error: 'User is already a collaborator.' });
        }

        note.collaborators.push({
            userId: userToAdd._id,
            permission,
            name: userToAdd.name,
            email: userToAdd.email,
        });

        await note.save();

        res.json({
            success: true,
            message: 'Collaborator added successfully.',
            collaborators: note.collaborators,
        });

    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});



router.delete('/notes/:id/collaborators', authenticateToken, async (req, res) => {
    const { email } = req.body;
    console.log(req.data)
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

        if (!note) {
            return res.status(404).json({ error: 'Note not found or you are not the owner.' });
        }

        const userToRemove = await User.findOne({ email });

        if (!userToRemove) {
            return res.status(404).json({ error: 'User with this email does not exist.' });
        }

        const initialLength = note.collaborators.length;

        note.collaborators = note.collaborators.filter(
            (collab) => collab.userId.toString() !== userToRemove._id.toString()
        );

        if (note.collaborators.length === initialLength) {
            return res.status(400).json({ error: 'User is not a collaborator.' });
        }

        await note.save();

        res.json({
            success: true,
            message: 'Collaborator removed successfully.',
            collaborators: note.collaborators,
        });

    } catch (error) {
        console.error('Error removing collaborator:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});








// GET /api/notes/users/collaborations
router.get('/collaborations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.find({
            collaborators: { $elemMatch: { userId: userId } },
            isDeleted: { $ne: true } // Optional: Exclude deleted notes
        })
            .sort({ updatedAt: -1 })
            .select(
                '_id title content isPinned isFavorite tags category createdAt updatedAt collaborators'
            );

        const formattedNotes = notes.map((note) => {
            const collaboratorInfo = note.collaborators.find(
                (c) => c.userId.toString() === userId
            );

            return {
                _id: note._id,
                title: note.title,
                content: note.content,
                isPinned: note.isPinned,
                isFavorite: note.isFavorite,
                tags: note.tags,
                collaborators: note.collaborators,
                category: note.category,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                permission: collaboratorInfo?.permission || 'view',
            };
        });

        res.status(200).json(formattedNotes);
    } catch (error) {
        console.error('Error fetching collaborations:', error);
        res.status(500).json({
            error: 'Failed to fetch collaboration notes',
        });
    }
});

router.get('/shared-by-me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.find({

            userId: userId,
            collaborators: { $exists: true, $not: { $size: 0 } },
        }).sort({ updatedAt: -1 });
        console.log(notes)
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching shared notes:', error);
        res.status(500).json({ error: 'Failed to fetch shared notes' });
    }
});




// Managing Categories

// Get categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ categories: user.categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// Update categories
router.put('/categories', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { categories: req.body.categories }},
      { new: true }
    );
    res.json({ categories: user.categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update categories' });
  }
});
module.exports = router