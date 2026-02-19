const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    role: { type: DataTypes.ENUM('member', 'employee', 'admin'), allowNull: false, defaultValue: 'member' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
