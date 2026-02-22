const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // รหัสผู้ใช้
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    // อีเมลสำหรับเข้าสู่ระบบ
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    // รหัสผ่านที่ถูกแฮช
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    // ชื่อ-นามสกุล
    name: { type: DataTypes.STRING(120), allowNull: false },
    // เบอร์โทรศัพท์
    phone: { type: DataTypes.STRING(30), allowNull: true },
    // บทบาทผู้ใช้
    role: { type: DataTypes.ENUM('member', 'employee', 'admin'), allowNull: false, defaultValue: 'member' },
    // สถานะการใช้งาน
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
