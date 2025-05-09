const Shift = require('../models/Shift');
const User = require('../models/User');

// Start a new shift
exports.startShift = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const shift = await Shift.create({
      user: req.user.id,
      employeeId: req.user.id,
      employeeName: req.user.name,
      startTime: new Date(),
      startLocation: { lat, lng },
      breaks: [],
    });

    res.json(shift);
  } catch (error) {
    console.error('Error starting shift:', error);
    res.status(500).json({ error: 'Failed to start shift' });
  }
};

// Start or end a break within an active shift
exports.breakShift = async (req, res) => {
  try {
    const { action } = req.body;

    const shift = await Shift.findOne({ user: req.user.id, endTime: null });
    if (!shift) return res.status(404).send('Shift not found');

    if (action === 'start') {
      shift.breaks.push({ start: new Date() });
    } else if (action === 'end') {
      const lastBreak = shift.breaks[shift.breaks.length - 1];
      if (lastBreak && !lastBreak.end) {
        lastBreak.end = new Date();
      } else {
        return res.status(400).json({ error: 'No active break to end' });
      }
    }

    await shift.save();
    res.json(shift);
  } catch (error) {
    console.error('Error updating break:', error);
    res.status(500).json({ error: 'Failed to update break' });
  }
};

// End an active shift
exports.endShift = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const shift = await Shift.findOne({ user: req.user.id, endTime: null });
    if (!shift) return res.status(404).send('No active shift');

    shift.endTime = new Date();
    shift.endLocation = { lat, lng };

    let breakDuration = 0;
    shift.breaks.forEach(b => {
      if (b.start && b.end) {
        breakDuration += (new Date(b.end) - new Date(b.start)) / 1000 / 3600;
      }
    });

    shift.totalHours = ((shift.endTime - shift.startTime) / 1000 / 3600) - breakDuration;
    shift.totalBreakTime = breakDuration;
    shift.totalWorkTime = shift.totalHours;

    await shift.save();

    res.json(shift);
  } catch (error) {
    console.error('Error ending shift:', error);
    res.status(500).json({ error: 'Failed to end shift' });
  }
};

// Get all shifts (Admin only)
exports.getAllShiftsWithUserDetails = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const shifts = await Shift.find().populate('user', 'name email');
    res.json(shifts);
  } catch (error) {
    console.error('Error fetching all shifts:', error);
    res.status(500).json({ error: 'Failed to get shifts' });
  }
};


// Get all shifts of the logged-in user
exports.getMyShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ user: req.user.id });
    res.json(shifts);
  } catch (error) {
    console.error('Error fetching my shifts:', error);
    res.status(500).json({ error: 'Failed to get your shifts' });
  }
};

// Save shift from frontend (fully built shift object)
exports.saveShift = async (req, res) => {
  try {
    const shift = await Shift.create({
      ...req.body,
      user:         req.user.id,
      employeeId:   req.user.id,
      employeeName: req.user.name,
    });
    res.status(201).json(shift);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save shift' });
  }
};

// Get shifts for a specific employee (by ID)
exports.getShiftsByEmployeeId = async (req, res) => {
  try {
    const shifts = await Shift.find({ employeeId: req.params.id });
    res.json(shifts);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
};
