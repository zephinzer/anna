if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (ex) {
    console.error(ex);
  }
}

const {
  ALLOWED_ORIGINS,
  BASIC_AUTH_USERS,
  DB_CLIENT,
  DB_HOST,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTION_POOL_MAX,
  DB_CONNECTION_POOL_MIN,
  DB_CONNECTION_URL,
  DB_MIGRATIONS_TABLE_NAME,
  HEALTH_CHECK_ENDPOINT,
  NODE_ENV,
  PORT,
  READINESS_CHECK_ENDPOINT,
  REALM,
  _,
} = process.env;

const allowedOrigins = (() => (
  (typeof ALLOWED_ORIGINS === 'string') ? ALLOWED_ORIGINS.split(',') : null
))();
const basicAuthUsers = (typeof BASIC_AUTH_USERS === 'string') ? (() => (
  BASIC_AUTH_USERS.split(',').map((userCredential) => (
    {
      username: userCredential.split(':')[0],
      password: userCredential.split(':')[1],
    }
  ))
))() : [];
const dbClient = DB_CLIENT || 'mysql2';
const dbHost = DB_HOST || '127.0.0.1';
const dbPort = DB_PORT || 3306;
const dbSchema = DB_SCHEMA || 'anna_development';
const dbUser = DB_USER || 'anna_development';
const dbPassword = DB_PASSWORD || 'anna_development';
const dbConnectionPoolMax = DB_CONNECTION_POOL_MAX || 10;
const dbConnectionPoolMin = DB_CONNECTION_POOL_MIN || 2;
const dbConnection = DB_CONNECTION_URL || {
  host: dbHost,
  port: dbPort,
  database: dbSchema,
  user: dbUser,
  password: dbPassword,
};
const dbMigrationsTableName = DB_MIGRATIONS_TABLE_NAME || 'db_migrations_list';
const env =
  [
    'development',
    'production',
  ].indexOf(NODE_ENV || '') !== -1 ?
    NODE_ENV : 'development';
const healthCheckEndpoint = HEALTH_CHECK_ENDPOINT || '/healthz';
const port = PORT || 4000;
const readinessCheckEndpoint = READINESS_CHECK_ENDPOINT || '/readyz';
const realm = REALM || 'ANNA';
const test = _.indexOf('mocha') !== -1;

console.info('ALLOWED_ORIGINS:', ALLOWED_ORIGINS, `(set to: ${allowedOrigins})`); // eslint-disable-line max-len
console.info('BASIC_AUTH_USERS:', `(registered: ${basicAuthUsers.map((user) => user.username)})`); // eslint-disable-line max-len
console.info('DB_CLIENT:', DB_CLIENT, `(set to: ${dbClient})`);
console.info('DB_SCHEMA:', DB_SCHEMA, `(set to: ${dbSchema})`);
console.info('DB_USER:', DB_USER, `(set to: ${dbUser})`);
console.info('DB_PASSWORD:', DB_PASSWORD, `(set to: ${dbPassword})`);
console.info('DB_CONNECTION_POOL_MAX:', DB_CONNECTION_POOL_MAX, `(set to: ${dbConnectionPoolMax})`); // eslint-disable-line max-len
console.info('DB_CONNECTION_POOL_MIN:', DB_CONNECTION_POOL_MIN, `(set to: ${dbConnectionPoolMin})`); // eslint-disable-line max-len
console.info('DB_CONNECTION_URL:', DB_CONNECTION_URL, `(set to: ${dbConnection})`); // eslint-disable-line max-len
console.info('DB_MIGRATIONS_TABLE_NAME:', DB_MIGRATIONS_TABLE_NAME, `(set to: ${dbMigrationsTableName})`); // eslint-disable-line max-len
console.info('HEALTH_CHECK_ENDPOINT:', HEALTH_CHECK_ENDPOINT, `(set to: ${healthCheckEndpoint})`); // eslint-disable-line max-len
console.info('NODE_ENV:', NODE_ENV, `(set to: ${env})`);
console.info('PORT:', PORT, `(set to: ${port})`);
console.info('READINESS_CHECK_ENDPOINT:', READINESS_CHECK_ENDPOINT, `(set to: ${readinessCheckEndpoint})`); // eslint-disable-line max-len
console.info('REALM:', REALM, `(set to: ${realm})`);
console.info('TEST:', `(set to: ${test})`);

module.exports = {
  allowedOrigins,
  basicAuthUsers,
  dbClient,
  dbHost,
  dbConnection,
  dbConnectionPoolMax,
  dbConnectionPoolMin,
  dbMigrationsTableName,
  dbPassword,
  dbSchema,
  dbUser,
  env,
  healthCheckEndpoint,
  port,
  readinessCheckEndpoint,
  realm,
  test,
};
