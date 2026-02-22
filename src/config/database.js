const { Sequelize } = require('sequelize');

const {
  DATABASE_URL,
  DATABASE_PUBLIC_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL,
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGSSLMODE
} = process.env;

const sslEnabled = DB_SSL === 'true' || PGSSLMODE === 'require';
const baseOptions = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {}
};

let sequelize;
if (DATABASE_URL || DATABASE_PUBLIC_URL) {
  sequelize = new Sequelize(DATABASE_URL || DATABASE_PUBLIC_URL, baseOptions);
} else {
  const host = DB_HOST || PGHOST;
  const port = Number(DB_PORT || PGPORT || 5432);
  const user = DB_USER || PGUSER;
  const password = DB_PASSWORD || PGPASSWORD;
  const name = DB_NAME || PGDATABASE;

  sequelize = new Sequelize(name, user, password, {
    host,
    port,
    ...baseOptions
  });
}

module.exports = sequelize;
