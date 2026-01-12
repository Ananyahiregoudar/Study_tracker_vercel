const connectDB = require('../lib/mongodb');
const { StudyRecord } = require('../lib/models');
const { handleCors } = require('../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const records = await StudyRecord.find();
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
