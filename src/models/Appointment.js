const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    branchId: { type: DataTypes.BIGINT, allowNull: false },
    memberId: { type: DataTypes.BIGINT, allowNull: false },
    employeeId: { type: DataTypes.BIGINT, allowNull: true },
    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'), allowNull: false, defaultValue: 'scheduled' },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'appointments',
    timestamps: true
  });

  return Appointment;
};
