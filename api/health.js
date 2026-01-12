const { handleCors } = require('../lib/cors');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;
  
  res.json({ status: 'ok', message: 'Backend is running' });
};
