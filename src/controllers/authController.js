const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register(req, res) {
  try {
    const { email, password, name, phone, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'email, password, name are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, phone, role: role || 'member' });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
