
const express = require('express');
const router = express.Router();

const Grade = require('../models/Grade');

// GET ALL GRADES
router.get('/', async (req, res) => {
    try {
        const grades = await Grade.find()
            .populate('student')
            .sort({ createdAt: -1 });

        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve grades',
            error: error.message
        });
    }
});

// ADD GRADE
router.post('/', async (req, res) => {
    try {
        console.log('GRADE REQUEST BODY:', req.body);

        if (!req.body) {
            return res.status(400).json({
                message: 'Request body is missing.'
            });
        }

        const {
            student,
            subject,
            semester,
            academicYear,
            grade,
            remarks
        } = req.body;

        const newGrade = new Grade({
            student,
            subject,
            semester,
            academicYear,
            grade,
            remarks
        });

        const savedGrade = await newGrade.save();

        res.status(201).json({
            message: 'Grade added successfully!',
            data: savedGrade
        });
    } catch (error) {
        console.error('GRADE ERROR:', error);

        res.status(400).json({
            message: 'Failed to add grade',
            error: error.message
        });
    }
});

// UPDATE GRADE
router.put('/:id', async (req, res) => {
    try {
        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedGrade) {
            return res.status(404).json({
                message: 'Grade not found'
            });
        }

        res.status(200).json({
            message: 'Grade updated successfully!',
            data: updatedGrade
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to update grade',
            error: error.message
        });
    }
});

// DELETE GRADE
router.delete('/:id', async (req, res) => {
    try {
        const deletedGrade = await Grade.findByIdAndDelete(
            req.params.id
        );

        if (!deletedGrade) {
            return res.status(404).json({
                message: 'Grade not found'
            });
        }

        res.status(200).json({
            message: 'Grade deleted successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to delete grade',
            error: error.message
        });
    }
});

module.exports = router;
