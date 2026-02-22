const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryItem = sequelize.define('InventoryItem', {
    // รหัสสินค้าในสต็อก
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // รหัสสาขา
    branchId: { type: DataTypes.BIGINT, allowNull: false },
    // รหัสสินค้า (SKU)
    sku: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    // ชื่อสินค้า
    name: { type: DataTypes.STRING(120), allowNull: false },
    // จำนวนคงเหลือ
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    // หน่วยนับ
    unit: { type: DataTypes.STRING(30), allowNull: true },
    // ต้นทุนต่อหน่วย
    cost: { type: DataTypes.DECIMAL(12, 2), allowNull: true }
  }, {
    tableName: 'inventory_items',
    timestamps: true
  });

  return InventoryItem;
};
