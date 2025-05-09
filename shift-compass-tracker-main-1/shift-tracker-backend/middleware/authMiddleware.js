const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function verifyToken(req, res, next) {
  const bearer = req.headers.authorization;        // Grab header
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = bearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;                               // attach full user
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};