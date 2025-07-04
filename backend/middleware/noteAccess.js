
const Note = require('../models/Note')
module.exports= async function canAccessNote  (req, res, next)  {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ error: 'Note not found' });

  const isOwner = note.userId.toString() === req.user.id;
  const collaborator = note.collaborators.find(
    (c) => c.userId.toString() === req.user.id
  );

  if (!isOwner && !collaborator) {
    return res.status(403).json({ error: 'Access denied' });
  }

  req.note = note;
  req.permission = isOwner ? 'owner' : collaborator.permission;
  next();
};
