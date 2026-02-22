const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transection = sequelize.define('Transection', {
    // รหัสรายการบันทึกรายรับ/รายจ่าย
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // ประเภทรายการ: รายรับ หรือ รายจ่าย
    type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
    // จำนวนเงิน
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
   // หมวดหมู่ (ลำดับ: 1=บริการตัดผม, 2=สินค้า, 3=ค่าใช้จ่ายอื่น)
    category: { type: DataTypes.STRING(120), allowNull: false },
    // รายละเอียดเพิ่มเติม
    note: { type: DataTypes.TEXT, allowNull: true },
    // วันที่เกิดรายการ
    occurredAt: { type: DataTypes.DATE, allowNull: false },
    // วิธีชำระเงิน
    method: { type: DataTypes.STRING(30), allowNull: true }
  }, {
    tableName: 'transections',
    timestamps: true
  });

  return Transection;
};
