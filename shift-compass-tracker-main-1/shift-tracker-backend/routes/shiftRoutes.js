const express        = require('express');
const router         = express.Router();
const verifyToken    = require('../middleware/authMiddleware');

const {
  saveShift,
  getShiftsByEmployeeId,
} = require('../controllers/shiftController');

router.post('/',            verifyToken, saveShift);
router.get('/employee/:id', verifyToken, getShiftsByEmployeeId);

module.exports = router;