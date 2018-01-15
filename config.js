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
  npm_lifecycle_event, // eslint-disable-line camel_case
  _,
} = process.env;

const allowedOrigins = (() => (
  (typeof ALLOWED_ORIGINS === 'string') ? ALLOWED_ORIGINS.split(',') : null
))();
console.info('ALLOWED_ORIGINS:', ALLOWED_ORIGINS, `(set to: ${allowedOrigins})`); // eslint-disable-line max-len

const basicAuthUsers = (typeof BASIC_AUTH_USERS === 'string') ? (() => (
  BASIC_AUTH_USERS.split(',').map((userCredential) => (
    {
      username: userCredential.split(':')[0],
      password: userCredential.split(':')[1],
    }
  ))
))() : [];
console.info('BASIC_AUTH_USERS:', `(registered: ${basicAuthUsers.map((user) => user.username)})`); // eslint-disable-line max-len

const dbHost = DB_HOST || '127.0.0.1';
console.info('DB_HOST:', DB_HOST, `(set to: ${dbHost})`);

const dbPort = DB_PORT || 3306;
console.info('DB_PORT:', DB_PORT, `(set to: ${dbPort})`);

const dbClient = DB_CLIENT || 'mysql2';
console.info('DB_CLIENT:', DB_CLIENT, `(set to: ${dbClient})`);

const dbSchema = DB_SCHEMA || 'anna_development';
console.info('DB_SCHEMA:', DB_SCHEMA, `(set to: ${dbSchema})`);

const dbUser = DB_USER || 'anna_development';
console.info('DB_USER:', DB_USER, `(set to: ${dbUser})`);

const dbPassword = DB_PASSWORD || 'anna_development';
console.info('DB_PASSWORD:', DB_PASSWORD, `(set to: ${dbPassword})`);

const dbConnectionPoolMax = DB_CONNECTION_POOL_MAX || 10;
console.info('DB_CONNECTION_POOL_MAX:', DB_CONNECTION_POOL_MAX, `(set to: ${dbConnectionPoolMax})`); // eslint-disable-line max-len

const dbConnectionPoolMin = DB_CONNECTION_POOL_MIN || 2;
console.info('DB_CONNECTION_POOL_MIN:', DB_CONNECTION_POOL_MIN, `(set to: ${dbConnectionPoolMin})`); // eslint-disable-line max-len

const dbConnection = DB_CONNECTION_URL || {
  host: dbHost,
  port: dbPort,
  database: dbSchema,
  user: dbUser,
  password: dbPassword,
};
console.info('DB_CONNECTION_URL:', DB_CONNECTION_URL, `(set to: ${dbConnection})`); // eslint-disable-line max-len

const dbMigrationsTableName = DB_MIGRATIONS_TABLE_NAME || 'db_migrations_list';
console.info('DB_MIGRATIONS_TABLE_NAME:', DB_MIGRATIONS_TABLE_NAME, `(set to: ${dbMigrationsTableName})`); // eslint-disable-line max-len

const healthCheckEndpoint = HEALTH_CHECK_ENDPOINT || '/healthz';
console.info('HEALTH_CHECK_ENDPOINT:', HEALTH_CHECK_ENDPOINT, `(set to: ${healthCheckEndpoint})`); // eslint-disable-line max-len

const env =
  [
    'development',
    'production',
  ].indexOf(NODE_ENV || '') !== -1 ?
    NODE_ENV : 'development';
console.info('NODE_ENV:', NODE_ENV, `(set to: ${env})`);

const port = PORT || 4000;
console.info('PORT:', PORT, `(set to: ${port})`);

const readinessCheckEndpoint = READINESS_CHECK_ENDPOINT || '/readyz';
console.info('READINESS_CHECK_ENDPOINT:', READINESS_CHECK_ENDPOINT, `(set to: ${readinessCheckEndpoint})`); // eslint-disable-line max-len

const realm = REALM || 'ANNA';
console.info('REALM:', REALM, `(set to: ${realm})`);

const test = _ ?
  (
    _.indexOf('mocha') !== -1 || npm_lifecycle_event.indexOf('mocha') !== -1
  ) : false;
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
