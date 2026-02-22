const { Transection } = require('../models');

async function list(req, res) {
  const rows = await Transection.findAll();
  return res.json(rows);
}

async function get(req, res) {
  const row = await Transection.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  return res.json(row);
}

async function create(req, res) {
  const { type, amount, category, note, occurredAt, method } = req.body;
  if (!type || amount === undefined || !category || !occurredAt) {
    return res.status(400).json({ message: 'type, amount, category, and occurredAt are required' });
  }
  const row = await Transection.create({ type, amount, category, note, occurredAt, method });
  return res.status(201).json(row);
}

async function update(req, res) {
  const row = await Transection.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { type, amount, category, note, occurredAt, method } = req.body;
  if (type !== undefined) row.type = type;
  if (amount !== undefined) row.amount = amount;
  if (category !== undefined) row.category = category;
  if (note !== undefined) row.note = note;
  if (occurredAt !== undefined) row.occurredAt = occurredAt;
  if (method !== undefined) row.method = method;
  await row.save();
  return res.json(row);
}

async function remove(req, res) {
  const row = await Transection.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
