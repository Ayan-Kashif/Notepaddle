const mongoose = require('mongoose');

const GuestNoteSchema = new mongoose.Schema({
 // custom ID like local-xxxx
  title: String,
  content: String,
  contentType: String,
  category: String,
  tags: [String],
  isPinned: Boolean,
  isFavorite: Boolean,
  isShared: Boolean,
  shareId: String,
  sharePermissions: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GuestNote', GuestNoteSchema);
