const { InventoryItem } = require('../models');

async function list(req, res) {
  const rows = await InventoryItem.findAll();
  return res.json(rows);
}

async function get(req, res) {
  const row = await InventoryItem.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  return res.json(row);
}

async function create(req, res) {
  const { branchId, sku, name, quantity, unit, cost } = req.body;
  if (!branchId || !sku || !name) {
    return res.status(400).json({ message: 'branchId, sku, name are required' });
  }
  const row = await InventoryItem.create({ branchId, sku, name, quantity, unit, cost });
  return res.status(201).json(row);
}

async function update(req, res) {
  const row = await InventoryItem.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { branchId, sku, name, quantity, unit, cost } = req.body;
  if (branchId !== undefined) row.branchId = branchId;
  if (sku !== undefined) row.sku = sku;
  if (name !== undefined) row.name = name;
  if (quantity !== undefined) row.quantity = quantity;
  if (unit !== undefined) row.unit = unit;
  if (cost !== undefined) row.cost = cost;
  await row.save();
  return res.json(row);
}

async function remove(req, res) {
  const row = await InventoryItem.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await row.destroy();
  return res.status(204).send();
}

module.exports = { list, get, create, update, remove };
