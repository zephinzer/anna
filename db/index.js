const knex = require('knex');
const config = require('../config');

const setError = _setError.bind(db);

/**
 * Resolves a connection function pointer which can be called.
 *
 * Example usage via promises:
 *   db('users')
 *     .then((con) => con.columnInfo())
 *     .then(console.info);
 *
 * Example usage via async/await:
 *   const connection = await db('users');
 *   const columnInfo = await connection().columnInfo();
 *   console.info(columnInfo);
 *
 * @param {String} tableName
 * @return {Promise}
 */
function db(tableName) {
  return new Promise((resolve, reject) => {
    if (db.initialised && db.connection) {
      resolve(db.connection.bind(null, tableName));
    } else if (Object.keys(db.error).length > 0) {
      reject(db.error);
    } else {
      const onInitialisationComplete =
        setInterval(() => {
          if (db.initialised && db.connection) {
            resolve(db.connection.bind(null, tableName));
            clearInterval(onInitialisationComplete);
            console.info(`db request for table '${tableName}' resolved.`);
          } else if (Object.keys(db.error).length > 0) {
            reject(db.error);
            clearInterval(onInitialisationComplete);
            console.info(`db request for table '${tableName}' rejected.`);
          } else {
            console.info(`db request for table '${tableName}' pending...`);
          }
        }, 250);
    }
  });
};

// used to store errors
db.error = {};

// initialisation flag
db.initialised = false;

// initialisation code that is called once checks are complete
db.init = function() {
  db.init.config();
  db.init.client();
  db.init.connection();
};

db._init = (dbAdapter) => {
  db.connection = dbAdapter(db.config);
  db.initialised = true;
  console.info('database successfully initialised');
};

// configuration path
db._config = '../knexfile';
// configuration initialisation code
db.init.config = () => {
  try {
    db.config = require(db._config);
    db.error.config = null;
  } catch (ex) {
    switch (ex.code) {
      case 'MODULE_NOT_FOUND':
        ex.message = `specified configuration at '${db._config}' could not be found.`; // eslint-disable-line max-len
        break;
    }
    setError('config', ex);
  }
};

// db client string name
db._client = config.dbClient;
// client initialisation code
db.init.client = () => {
  try {
    db.client = require(db._client);
    db.error.client = null;
  } catch (ex) {
    switch (ex.code) {
      case 'MODULE_NOT_FOUND':
        ex.message = `specified client '${db._client}' is not valid.`; // eslint-disable-line max-len
        break;
    }
    setError('client', ex);
  }
};

// connection initialisation code
db.init.connection = () => {
  if (db.error) {
    if (db.error.config) {
      throw new Error(db.error.config);
    } else if (db.error.client) {
      throw new Error(db.error.client);
    }
  }
  switch (db._client) {
    case 'mysql2':
      db.client
        .createConnection(
          ((typeof db.config.connection === 'string') ?
            db.config.connection : {
              host: db.config.connection.host,
              port: db.config.connection.port,
              user: db.config.connection.user,
              password: db.config.connection.password,
              database: db.config.connection.database,
            })
        )
        .query('SELECT 1+1;', (err, res) => {
          if (err) {
            setError('connection', err, true);
          } else {
            db._init(knex);
            db.error.connection = null;
          }
        });
      break;
    default:
      setError('connection', {
        code: 'UNSUPPORTED_CLIENT',
        message: `the ${db._client} is valid but is unsupported.`, // eslint-disable-line max-len
      });
  }
};

module.exports = db;

/**
 * Sets an error on `this`. Bind it to the object you wish to set the error on.
 *
 * @param {String} functionality
 * @param {Object} errorOrException
 * @param {String} errorOrException.code
 * @param {String} errorOrException.message
 * @param {Boolean} killApplication - when set, process.exit(1) is called.
 */
function _setError(functionality, errorOrException, killApplication) {
  this[functionality] = null;
  this.error = this.error || {};
  this.error[functionality] =
    `${errorOrException.code} : ${errorOrException.message}`;
  console.error(this.error[functionality]);
  if (
    killApplication
    && config.test !== true
  ) {
    process.exit(1);
  }
};
