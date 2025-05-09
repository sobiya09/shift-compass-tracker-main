const express      = require('express');
const router       = express.Router();
const verifyToken  = require('../middleware/authMiddleware');
const User         = require('../models/User');
const Shift        = require('../models/Shift');

router.get('/employees', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied' });

  try {
    const employees = await User.find({ role: 'employee' })
      .select('name email')
      .lean();

    const shifts = await Shift.find({})
      .select('-__v')
      .lean();

    const employeesWithShifts = employees.map((emp) => ({
      ...emp,
      shifts: shifts.filter((s) => s.employeeId === emp._id.toString()),
    }));

    res.json(employeesWithShifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;