
const express = require('express');
const router = express.Router();

const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL ATTENDANCE RECORDS - PROTECTED
router.get('/', authMiddleware, async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate('student')
            .sort({ date: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET TODAY'S ATTENDANCE SUMMARY - PROTECTED
router.get('/summary/today', authMiddleware, async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const records = await Attendance.find({
            date: { $gte: start, $lte: end }
        });

        const summary = {
            present: records.filter(r => r.status === 'Present').length,
            absent: records.filter(r => r.status === 'Absent').length,
            late: records.filter(r => r.status === 'Late').length
        };

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// MARK STUDENT ATTENDANCE - PROTECTED
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { student, status, remarks } = req.body;

        if (!student || !['Present', 'Absent', 'Late'].includes(status)) {
            return res.status(400).json({
                message: 'Valid student and attendance status are required.'
            });
        }

        const studentExists = await Student.findById(student);

        if (!studentExists) {
            return res.status(404).json({
                message: 'Student not found.'
            });
        }

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const existing = await Attendance.findOne({
            student,
            date: { $gte: start, $lte: end }
        });

        if (existing) {
            return res.status(409).json({
                message: 'Attendance already recorded today.'
            });
        }

        const record = await Attendance.create({
            student,
            status,
            remarks: remarks || ''
        });

        res.status(201).json({
            message: 'Attendance recorded successfully!',
            attendance: record
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
