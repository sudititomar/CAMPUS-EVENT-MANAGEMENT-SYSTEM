const Registration = require('../models/Registration');

const getParticipants = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'name email') // ← 'user' matches your Registration model
      .sort({ createdAt: -1 });

    const participants = registrations.map(r => ({
      name:         r.user?.name  || 'Unknown',
      email:        r.user?.email || 'N/A',
      registeredAt: r.createdAt
    }));

    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch participants.' });
  }
};

module.exports = { getParticipants };