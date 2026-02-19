const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryItem = sequelize.define('InventoryItem', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    branchId: { type: DataTypes.BIGINT, allowNull: false },
    sku: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.STRING(30), allowNull: true },
    cost: { type: DataTypes.DECIMAL(12, 2), allowNull: true }
  }, {
    tableName: 'inventory_items',
    timestamps: true
  });

  return InventoryItem;
};
