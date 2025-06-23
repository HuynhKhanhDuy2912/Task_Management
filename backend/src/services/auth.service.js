const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

exports.register = async ({ email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Wrong password');
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
};