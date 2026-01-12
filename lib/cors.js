// CORS helper function for serverless functions
function setCorsHeaders(res) {
  const origin = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(204).end();
    return true;
  }
  setCorsHeaders(res);
  return false;
}

module.exports = { setCorsHeaders, handleCors };
