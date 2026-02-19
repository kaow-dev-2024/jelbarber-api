const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    appointmentId: { type: DataTypes.BIGINT, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: 'THB' },
    method: { type: DataTypes.ENUM('cash', 'card', 'transfer', 'qr'), allowNull: false, defaultValue: 'cash' },
    status: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), allowNull: false, defaultValue: 'paid' },
    paidAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  return Payment;
};
