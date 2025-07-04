const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const { sendVerificationEmail } = require('../utils/sendEmail');
require('dotenv').config();
const authenticate= require('../middleware/authenticate')
const upload = require('../middleware/upload');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


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

// =========================
// 📩 Register Route
// =========================
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check existing users
        const existingUser = await User.findOne({ email });
        const existingPending = await PendingUser.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }
        if (existingPending) {
            return res.status(400).json({ message: 'User pending verification. Check your email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const pendingUser = new PendingUser({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            emailToken: emailVerificationToken,
        });

        await pendingUser.save();

        // Generate JWT (even while pending)
        const jwtToken = jwt.sign(
            { id: pendingUser._id, email, name, isVerified: false },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log(emailVerificationToken)
        console.log(process.env.FRONTEND_URL)

        // Send verification email
        // brokenLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
        // const cleanLink = brokenLink.substring(brokenLink.indexOf('/verify-email'));

        // const frontendURL = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '');

        // const verificationLink = `${frontendURL}${cleanLink}`;

        // console.log(verificationLink);


        await sendVerificationEmail(email, emailVerificationToken);

        return res.status(200).json({
            message: 'Registration successful. Check your email to verify.',
            token: jwtToken,
        });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});



router.post('/verify-email', async (req, res) => {
    const { token } = req.body;

    try {
        const pendingUser = await PendingUser.findOne({ emailToken: token });

        if (!pendingUser) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        // Upsert user atomically
        const user = await User.findOneAndUpdate(
            { email: pendingUser.email },
            {
                $setOnInsert: {
                    name: pendingUser.name,
                    password: pendingUser.password, // Already hashed
                    isVerified: true,
                },
            },
            { upsert: true, new: true }
        );

        // Always remove pending user
        await PendingUser.deleteOne({ _id: pendingUser._id });

        // JWT
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name, isVerified: true },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Email verified successfully!',
            token: jwtToken,
        });

    } catch (error) {
        console.error('Verify Email Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});





// =========================
// 🔐 Login Route


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check user existence
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found or not verified' });
        }

        // 2. Check if user is banned
        if (user.isBanned) {
            return res.status(403).json({ message: 'User is banned. Please contact support.' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. Sign JWT
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name, isVerified: user.isVerified },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Respond
        return res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


//Changing password
router.put('/password',authenticateToken, async (req,res) => {
  const userId = req.user.id; // Assuming you have middleware that sets req.user
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;


