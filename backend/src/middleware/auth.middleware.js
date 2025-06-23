const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Đúng với file hiện tại của bạn là user.js

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // 👈 đảm bảo có `req.user.id`

    // Hoặc nếu bạn muốn có đầy đủ thông tin user (tùy dự án có cần hay không):
    // req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
