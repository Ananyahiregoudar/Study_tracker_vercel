const connectDB = require('../lib/mongodb');
const { StudyRecord } = require('../lib/models');
const { handleCors } = require('../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  const { id } = req.query;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const record = await StudyRecord.findById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.json({ success: true, data: record });
    }

    if (req.method === 'PUT') {
      const { syllabusStatus, studyHoursCompleted } = req.body;
      const updated = await StudyRecord.findByIdAndUpdate(
        id,
        { ...(syllabusStatus && { syllabusStatus }), ...(studyHoursCompleted !== undefined && { studyHoursCompleted }) },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.json({ success: true, message: 'Updated successfully', data: updated });
    }

    if (req.method === 'DELETE') {
      const deleted = await StudyRecord.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }
      return res.json({ success: true, message: 'Deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
