const cors = require('cors');
const config = require('../config');

module.exports = corsMiddleware;

/**
 * Returns a CORS middleware
 *
 * @return {function} middleware for Express
 */
function corsMiddleware() {
  return cors({
    allowedHeaders: corsMiddleware.allowedHeaders,
    methods: corsMiddleware.allowedMethods,
    origin: corsMiddleware.originFilter,
  });
};

corsMiddleware.allowedHeaders = [
  'Content-Type',
  'X-AuthKey',
  'X-AuthToken',
];

corsMiddleware.allowedMethods = [
  'GET',
  'POST',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
];

corsMiddleware.originFilter = (origin, callback) => {
  if (config.allowedOrigins === null) {
    callback(false);
  } else if (
    config.allowedOrigins.indexOf(origin) !== -1
  ) {
    callback(null, true);
  } else {
    callback(false);
  }
};
