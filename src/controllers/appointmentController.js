const { Appointment } = require('../models');

async function list(req, res) {
  const rows = await Appointment.findAll();
  return res.json(rows);
}

async function get(req, res) {
  const row = await Appointment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  return res.json(row);
}

async function create(req, res) {
  const { branchId, memberId, employeeId, startAt, endAt, status, notes } = req.body;
  if (!branchId || !memberId || !startAt || !endAt) {
    return res.status(400).json({ message: 'branchId, memberId, startAt, endAt are required' });
  }
  const row = await Appointment.create({ branchId, memberId, employeeId, startAt, endAt, status, notes });
  return res.status(201).json(row);
}

async function update(req, res) {
  const row = await Appointment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { branchId, memberId, employeeId, startAt, endAt, status, notes } = req.body;
  if (branchId !== undefined) row.branchId = branchId;
  if (memberId !== undefined) row.memberId = memberId;
  if (employeeId !== undefined) row.employeeId = employeeId;
  if (startAt !== undefined) row.startAt = startAt;
  if (endAt !== undefined) row.endAt = endAt;
  if (status !== undefined) row.status = status;
  if (notes !== undefined) row.notes = notes;
  await row.save();
  return res.json(row);
}

async function remove(req, res) {
  const row = await Appointment.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
