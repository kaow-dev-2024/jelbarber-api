const { Branch } = require('../models');

async function list(req, res) {
  const rows = await Branch.findAll();
  return res.json(rows);
}

async function get(req, res) {
  const row = await Branch.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  return res.json(row);
}

async function create(req, res) {
  const { name, address, phone, isActive } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });
  const row = await Branch.create({ name, address, phone, isActive });
  return res.status(201).json(row);
}

async function update(req, res) {
  const row = await Branch.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { name, address, phone, isActive } = req.body;
  if (name !== undefined) row.name = name;
  if (address !== undefined) row.address = address;
  if (phone !== undefined) row.phone = phone;
  if (isActive !== undefined) row.isActive = isActive;
  await row.save();
  return res.json(row);
}

async function remove(req, res) {
  const row = await Branch.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
