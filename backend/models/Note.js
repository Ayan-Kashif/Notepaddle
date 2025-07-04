
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  contentType: { type: String, default: 'plain' },
  category: String,
  tags: [String],
  isPinned: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  shareId: String,
  sharePermissions: String,
  sharedWith: [String],
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        required: true,
      },
      name: { type: String, required: true,trim:true },
      email: {
        type: String,
        required: true,
       
        lowercase: true,
      },
    }
  ],


  version: { type: Number, default: 1 },
  lastEditedBy: String,
  isPrivate: { type: Boolean, default: false },
  password: String,
  passwordHint: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: {
    type: Date,
    default: null,
  }

});

module.exports = mongoose.model('Note', noteSchema);