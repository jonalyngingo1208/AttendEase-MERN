
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please fill in all required fields.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters.'
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // PUBLIC REGISTRATION IS ALWAYS TEACHER
        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'teacher'
        });

        res.status(201).json({
            message: 'Account registered successfully!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// CHANGE PASSWORD
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Please fill in all required fields.'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'New password must be at least 8 characters.'
            });
        }

        // FIND LOGGED-IN USER
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        // CHECK CURRENT PASSWORD
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect.'
            });
        }

        // HASH AND SAVE NEW PASSWORD
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            message: 'Password changed successfully!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
