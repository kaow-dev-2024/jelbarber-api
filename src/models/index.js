const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Branch = require('./Branch')(sequelize);
const Appointment = require('./Appointment')(sequelize);
const Payment = require('./Payment')(sequelize);
const InventoryItem = require('./InventoryItem')(sequelize);
const Transection = require('./Transection')(sequelize);

Branch.hasMany(Appointment, { foreignKey: 'branchId' });
Appointment.belongsTo(Branch, { foreignKey: 'branchId' });

User.hasMany(Appointment, { foreignKey: 'memberId', as: 'memberAppointments' });
Appointment.belongsTo(User, { foreignKey: 'memberId', as: 'member' });

User.hasMany(Appointment, { foreignKey: 'employeeId', as: 'employeeAppointments' });
Appointment.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });

Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Branch.hasMany(InventoryItem, { foreignKey: 'branchId' });
InventoryItem.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = {
  sequelize,
  User,
  Branch,
  Appointment,
  Payment,
  InventoryItem,
  Transection
};
