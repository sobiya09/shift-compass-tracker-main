const mongoose = require('mongoose');

const breakSchema = new mongoose.Schema({
  type: String,
  startTime: Date,
  endTime: Date,
});

const shiftSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId:  { type: String, required: true },
    employeeName:{ type: String },

    startTime: Date,
    endTime:   Date,

    breaks: [breakSchema],

    startLocation: { latitude: Number, longitude: Number },
    endLocation:   { latitude: Number, longitude: Number },

    totalWorkTime:  Number,
    totalBreakTime: Number,
    status:        String,
    date:          String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shift', shiftSchema);
