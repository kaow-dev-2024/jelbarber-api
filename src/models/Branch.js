const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Branch = sequelize.define('Branch', {
    // รหัสสาขา
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // ชื่อสาขา
    name: { type: DataTypes.STRING(120), allowNull: false },
    // ที่อยู่สาขา
    address: { type: DataTypes.STRING(255), allowNull: true },
    // เบอร์โทรสาขา
    phone: { type: DataTypes.STRING(30), allowNull: true },
    // สถานะการใช้งานสาขา
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'branches',
    timestamps: true
  });

  return Branch;
};
