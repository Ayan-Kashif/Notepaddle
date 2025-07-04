// models/PendingUser.js

const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true, // Hashed password
    },


    isVerified: {
        type: Boolean,
        default: false,
    },
    emailToken: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // ⏳ Optional: Automatically delete after 1 hour (3600 seconds)
    },
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
