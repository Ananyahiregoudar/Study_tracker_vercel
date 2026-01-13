/**
 * Local Development Server
 * This file is for local development only. On Vercel, serverless functions in /api are used.
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./lib/mongodb');
const { User, StudyRecord } = require('./lib/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
    try {
        await connectDB();
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        await connectDB();
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- Study Routes ---
app.post('/api/addStudyRecord', async (req, res) => {
    try {
        await connectDB();
        const { studentId, subjectName, examDate, studyHoursPlanned } = req.body;
        if (!studentId || !subjectName || !examDate || !studyHoursPlanned) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const newRecord = new StudyRecord({
            studentId, subjectName, examDate: new Date(examDate), studyHoursPlanned
        });
        const savedRecord = await newRecord.save();
        res.status(201).json({ success: true, message: 'Study record added successfully', data: savedRecord });
    } catch (error) {
        console.error('Error adding study record:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/studyRecords', async (req, res) => {
    try {
        await connectDB();
        const records = await StudyRecord.find();
        res.json({ success: true, data: records });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/studyRecord/:id', async (req, res) => {
    try {
        await connectDB();
        const record = await StudyRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/studyRecord/:id', async (req, res) => {
    try {
        await connectDB();
        const { syllabusStatus, studyHoursCompleted } = req.body;
        const updated = await StudyRecord.findByIdAndUpdate(
            req.params.id,
            { ...(syllabusStatus && { syllabusStatus }), ...(studyHoursCompleted !== undefined && { studyHoursCompleted }) },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });
        res.json({ success: true, message: 'Updated successfully', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/api/studyRecord/:id', async (req, res) => {
    try {
        await connectDB();
        const deleted = await StudyRecord.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- Analytics Routes ---
app.get('/api/analytics', async (req, res) => {
    try {
        await connectDB();
        const records = await StudyRecord.find();
        const totalHours = records.reduce((sum, r) => sum + (r.studyHoursCompleted || 0), 0);
        const plannedHours = records.reduce((sum, r) => sum + (r.studyHoursPlanned || 0), 0);

        const subjectStats = {};
        records.forEach(r => {
            if (!subjectStats[r.subjectName]) subjectStats[r.subjectName] = 0;
            subjectStats[r.subjectName] += (r.studyHoursCompleted || 0);
        });

        const subjectChartData = Object.keys(subjectStats).map(key => ({
            name: key,
            hours: subjectStats[key]
        }));

        res.json({
            success: true,
            data: {
                totalHours,
                plannedHours,
                subjectChartData,
                recordCount: records.length
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error handling middleware
app.use((err, res) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server error'
    });
});

// Start server only in local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;