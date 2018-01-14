/**
 * Configuration file for Knex to operate
 */

const config = require('./config');

module.exports = {
  debug: (config.env === 'development'),
  client: config.dbClient,
  connection: config.dbConnection,
  pool: {
    min: config.dbConnectionPoolMin,
    max: config.dbConnectionPoolMax,
  },
  migrations: {
    tableName: config.dbMigrationsTableName,
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
