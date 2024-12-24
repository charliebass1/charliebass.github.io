const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ date: -1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new session
router.post('/', async (req, res) => {
    const session = new Session({
        date: req.body.date,
        duration: req.body.duration,
        temperature: req.body.temperature
    });

    try {
        const newSession = await session.save();
        res.status(201).json(newSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete session
router.delete('/:id', async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: 'Session deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 