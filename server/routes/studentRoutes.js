
const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL STUDENTS - PROTECTED
router.get('/', authMiddleware, async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD STUDENT - PROTECTED
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { studentId, name, email, course, yearLevel } = req.body;

        const newStudent = new Student({
            studentId,
            name,
            email,
            course,
            yearLevel
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({
            message: 'Student added successfully!',
            student: savedStudent
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE STUDENT - PROTECTED
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: 'Student not found.'
            });
        }

        res.json({
            message: 'Student updated successfully!',
            student: updatedStudent
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE STUDENT - PROTECTED
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Student not found.'
            });
        }

        res.json({
            message: 'Student deleted successfully!'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
