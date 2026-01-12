const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// StudyRecord Schema
const studyRecordSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    syllabusStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    studyHoursPlanned: {
        type: Number,
        required: true
    },
    studyHoursCompleted: {
        type: Number,
        default: 0
    },
    examStatus: {
        type: String,
        enum: ['Upcoming', 'Completed'],
        default: 'Upcoming'
    }
}, {
    timestamps: true
});

// Export models (will be created if they don't exist)
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const StudyRecord = mongoose.models.StudyRecord || mongoose.model('StudyRecord', studyRecordSchema);

module.exports = { User, StudyRecord };
