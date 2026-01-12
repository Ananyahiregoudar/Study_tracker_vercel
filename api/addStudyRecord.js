const connectDB = require('../lib/mongodb');
const { StudyRecord } = require('../lib/models');
const { handleCors } = require('../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { studentId, subjectName, examDate, studyHoursPlanned } = req.body;
    
    if (!studentId || !subjectName || !examDate || !studyHoursPlanned) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const newRecord = new StudyRecord({
      studentId,
      subjectName,
      examDate: new Date(examDate),
      studyHoursPlanned
    });
    
    const savedRecord = await newRecord.save();
    
    res.status(201).json({ success: true, message: 'Study record added successfully', data: savedRecord });
  } catch (error) {
    console.error('Error adding study record:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
