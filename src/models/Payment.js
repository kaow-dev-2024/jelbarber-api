const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    // รหัสการชำระเงิน
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // รหัสนัดหมายที่เกี่ยวข้อง
    appointmentId: { type: DataTypes.BIGINT, allowNull: false },
    // จำนวนเงิน
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    // สกุลเงิน
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: 'THB' },
    // ช่องทางการชำระเงิน
    method: { type: DataTypes.ENUM('cash', 'card', 'transfer', 'qr'), allowNull: false, defaultValue: 'cash' },
    // สถานะการชำระเงิน
    status: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), allowNull: false, defaultValue: 'paid' },
    // วันที่/เวลาที่ชำระเงิน
    paidAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  return Payment;
};
