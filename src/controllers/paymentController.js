const { Payment } = require('../models');

async function list(req, res) {
  const rows = await Payment.findAll();
  return res.json(rows);
}

async function get(req, res) {
  const row = await Payment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  return res.json(row);
}

async function create(req, res) {
  const { appointmentId, amount, currency, method, status, paidAt } = req.body;
  if (!appointmentId || amount === undefined) {
    return res.status(400).json({ message: 'appointmentId and amount are required' });
  }
  const row = await Payment.create({ appointmentId, amount, currency, method, status, paidAt });
  return res.status(201).json(row);
}

async function update(req, res) {
  const row = await Payment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { appointmentId, amount, currency, method, status, paidAt } = req.body;
  if (appointmentId !== undefined) row.appointmentId = appointmentId;
  if (amount !== undefined) row.amount = amount;
  if (currency !== undefined) row.currency = currency;
  if (method !== undefined) row.method = method;
  if (status !== undefined) row.status = status;
  if (paidAt !== undefined) row.paidAt = paidAt;
  await row.save();
  return res.json(row);
}

async function remove(req, res) {
  const row = await Payment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
