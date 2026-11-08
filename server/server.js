
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/schedules', scheduleRoutes);

// Home Route
app.get('/', (req, res) => {
    res.send('AttendEase API is running successfully!');
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log('================================');
        console.log('AttendEase Server is Running!');
        console.log(`Server URL: http://localhost:${PORT}`);
        console.log('Schedule API is Connected!');
        console.log('================================');
    });
};

startServer();
