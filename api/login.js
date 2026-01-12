const connectDB = require('../lib/mongodb');
const { User } = require('../lib/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleCors } = require('../lib/cors');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
};
