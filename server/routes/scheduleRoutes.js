
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// JWT AUTH MIDDLEWARE
const authMiddleware = require('../middleware/authMiddleware');

// SCHEDULE SCHEMA
const scheduleSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// SCHEDULE MODEL
const Schedule =
  mongoose.models.Schedule ||
  mongoose.model('Schedule', scheduleSchema);

// GET ALL SCHEDULES
router.get('/', authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ day: 1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD SCHEDULE
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, course, day, startTime, endTime, room } = req.body;

    const newSchedule = await Schedule.create({
      subject,
      course,
      day,
      startTime,
      endTime,
      room
    });

    res.status(201).json({
      message: 'Schedule added successfully!',
      schedule: newSchedule
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE SCHEDULE
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({
        message: 'Schedule not found.'
      });
    }

    res.json({
      message: 'Schedule updated successfully!',
      schedule: updatedSchedule
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE SCHEDULE
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSchedule) {
      return res.status(404).json({
        message: 'Schedule not found.'
      });
    }

    res.json({
      message: 'Schedule deleted successfully!'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
