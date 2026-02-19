const { Sequelize } = require('sequelize');

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT || 5432),
  dialect: 'postgres',
  logging: false,
  dialectOptions: DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {}
});

module.exports = sequelize;
