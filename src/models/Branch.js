const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Branch = sequelize.define('Branch', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'branches',
    timestamps: true
  });

  return Branch;
};
