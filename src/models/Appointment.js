const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    // รหัสรายการนัดหมาย
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // รหัสสาขา
    branchId: { type: DataTypes.BIGINT, allowNull: false },
    // รหัสสมาชิก/ลูกค้า
    memberId: { type: DataTypes.BIGINT, allowNull: false },
    // รหัสพนักงาน (ถ้ายังไม่กำหนดให้เป็น null ได้)
    employeeId: { type: DataTypes.BIGINT, allowNull: true },
    // เวลาเริ่มนัดหมาย
    startAt: { type: DataTypes.DATE, allowNull: false },
    // เวลาสิ้นสุดนัดหมาย
    endAt: { type: DataTypes.DATE, allowNull: false },
    // สถานะนัดหมาย
    status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'), allowNull: false, defaultValue: 'scheduled' },
    // หมายเหตุเพิ่มเติม
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'appointments',
    timestamps: true
  });

  return Appointment;
};
