const mongoose = require('mongoose');

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

module.exports = mongoose.model('StudyRecord', studyRecordSchema);
