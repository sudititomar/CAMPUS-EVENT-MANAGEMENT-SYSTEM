const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const protect = require('../middleware/auth');

// POST /api/registrations - register for an event
router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check capacity
    const count = await Registration.countDocuments({ event: eventId, status: 'registered' });
    if (count >= event.capacity) return res.status(400).json({ message: 'Event is full' });

    const reg = await Registration.create({ user: req.user.id, event: eventId });
    res.status(201).json(reg);
  } catch (err) {
    // Duplicate key = already registered
    if (err.code === 11000) return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/my - get logged-in user's registrations
router.get('/my', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title location date capacity organizer')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations.' });
  }
});

// DELETE /api/registrations/:id - cancel registration
router.delete('/:id', protect, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    reg.status = 'cancelled';
    await reg.save();
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
