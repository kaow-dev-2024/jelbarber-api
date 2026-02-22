const { User, Branch } = require('../models');
const bcrypt = require('bcryptjs');

function attachBranchForEmployee(user) {
  const row = user.get({ plain: true });
  if (row.role === 'employee') {
    row.branch = row.Branch || null;
  }
  delete row.Branch;
  if (row.role !== 'employee') {
    delete row.branch;
  }
  return row;
}

async function list(req, res) {
  const users = await User.findAll({
    attributes: ['id', 'email', 'name', 'phone', 'role', 'isActive', 'branchId', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Branch,
        attributes: ['id', 'name', 'address', 'phone', 'isActive'],
        required: false
      }
    ]
  });
  return res.json(users.map(attachBranchForEmployee));
}

async function get(req, res) {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'email', 'name', 'phone', 'role', 'isActive', 'branchId', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Branch,
        attributes: ['id', 'name', 'address', 'phone', 'isActive'],
        required: false
      }
    ]
  });
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json(attachBranchForEmployee(user));
}

async function create(req, res) {
  const { email, password, name, phone, role, isActive, branchId } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'email, password, name are required' });
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name, phone, role, isActive, branchId });
  return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
}

async function update(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { name, phone, role, isActive, password, branchId } = req.body;
  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (branchId !== undefined) user.branchId = branchId;
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
