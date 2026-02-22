const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Branch = require('./Branch')(sequelize);
const Appointment = require('./Appointment')(sequelize);
const InventoryItem = require('./InventoryItem')(sequelize);
const Transection = require('./Transection')(sequelize);

Branch.hasMany(Appointment, { foreignKey: 'branchId' });
Appointment.belongsTo(Branch, { foreignKey: 'branchId' });

Branch.hasMany(User, { foreignKey: 'branchId' });
User.belongsTo(Branch, { foreignKey: 'branchId' });

User.hasMany(Appointment, { foreignKey: 'memberId', as: 'memberAppointments' });
Appointment.belongsTo(User, { foreignKey: 'memberId', as: 'member' });

User.hasMany(Appointment, { foreignKey: 'employeeId', as: 'employeeAppointments' });
Appointment.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });


Branch.hasMany(InventoryItem, { foreignKey: 'branchId' });
InventoryItem.belongsTo(Branch, { foreignKey: 'branchId' });

Branch.hasMany(Transection, { foreignKey: 'branchId' });
Transection.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = {
  sequelize,
  User,
  Branch,
  Appointment,
  InventoryItem,
  Transection
};
