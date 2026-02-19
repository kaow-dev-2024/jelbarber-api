const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function list(req, res) {
  const users = await User.findAll({
    attributes: ['id', 'email', 'name', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt']
  });
  return res.json(users);
}

async function get(req, res) {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'email', 'name', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt']
  });
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json(user);
}

async function create(req, res) {
  const { email, password, name, phone, role, isActive } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'email, password, name are required' });
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name, phone, role, isActive });
  return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
}

async function update(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { name, phone, role, isActive, password } = req.body;
  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();
  return res.json({ id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive });
}

async function remove(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await user.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
