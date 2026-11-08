
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    semester: {
      type: String,
      enum: ['First Semester', 'Second Semester'],
      required: true
    },

    academicYear: {
      type: String,
      required: true
    },

    grade: {
      type: Number,
      required: true,
      min: 1.00,
      max: 5.00
    },

    remarks: {
      type: String,
      enum: ['Passed', 'Failed'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grade', gradeSchema);
