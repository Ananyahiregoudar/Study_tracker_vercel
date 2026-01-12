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
};
