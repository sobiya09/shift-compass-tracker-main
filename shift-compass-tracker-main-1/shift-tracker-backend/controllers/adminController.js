const { Parser } = require('json2csv');
const Shift = require('../models/shiftModel');
const User = require('../models/userModel');

exports.exportShiftsCSV = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });

    const allShifts = await Promise.all(
      employees.map(async (emp) => {
        const shifts = await Shift.find({ employeeId: emp._id });
        return shifts.map((s) => ({
          employeeId: emp._id,
          name: emp.name,
          email: emp.email,
          date: s.startTime.toISOString().split('T')[0],
          startTime: s.startTime,
          endTime: s.endTime,
          totalWorkTime: s.totalWorkTime,
          totalBreakTime: s.totalBreakTime,
        }));
      })
    );

    const flatShifts = allShifts.flat();

    const fields = [
      'employeeId',
      'name',
      'email',
      'date',
      'startTime',
      'endTime',
      'totalWorkTime',
      'totalBreakTime',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flatShifts);

    res.header('Content-Type', 'text/csv');
    res.attachment('employee_shifts.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

// Optional: JSON export
exports.exportShiftsJSON = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });

    const allShifts = await Promise.all(
      employees.map(async (emp) => {
        const shifts = await Shift.find({ employeeId: emp._id });
        return shifts.map((s) => ({
          employeeId: emp._id,
          name: emp.name,
          email: emp.email,
          date: s.startTime.toISOString().split('T')[0],
          startTime: s.startTime,
          endTime: s.endTime,
          totalWorkTime: s.totalWorkTime,
          totalBreakTime: s.totalBreakTime,
        }));
      })
    );

    const flatShifts = allShifts.flat();
    res.json(flatShifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export JSON' });
  }
};
