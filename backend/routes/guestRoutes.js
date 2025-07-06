const express = require('express');
const router = express.Router();
const GuestNote = require('../models/GuestNote');

// POST /api/guests/notes — Create a guest note
router.post('/notes', async (req, res) => {
    try {
        const { id, ...rest } = req.body;
        const note = new GuestNote(rest);
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to create guest note' });
    }
});

// PUT /api/guests/notes/:id — Update guest note (e.g., add shareId)
router.put('/notes/:id', async (req, res) => {
    try {
        const note = await GuestNote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update guest note' });
    }
});

// GET /api/guests/shared/:id — Get a shared guest note by shareId
router.get('/shared/:id', async (req, res) => {
    try {
        const shareId = req.params.id;
        const note = await GuestNote.findOne({ shareId, isShared: true });
        if (!note) return res.status(404).json({ error: 'Note not found or not shared' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch shared note' });
    }
});

module.exports = router;
