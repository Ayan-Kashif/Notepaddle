// models/User.js
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  }
,
  password: {
    type: String,
    required: true, // Hashed password
  },
  bio: {
    type: String,

  },
    resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  avatar: {
    type: String,

  },
    categories: [{
    id: String,
    name: String,
    color: {
      type: String,
      default: '#6366F1'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: { type: Boolean, default: true },
  notes: [
    {
      title: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],

});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // 💡 Skip hashing if password is already hashed
  if (this.password.startsWith('$2')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Auto-add default category
userSchema.pre('save', function(next) {
  if (this.isNew && this.categories.length === 0) {
    this.categories.push({
      id: 'default',
      name: 'General',
      color: '#6366F1',
      isDefault: true
    });
  }
  next();
});


module.exports = mongoose.model('User', userSchema);
