const compression = require('compression');

module.exports = compressionMiddleware;

/**
 * Returns a compression middleware for Express
 *
 * @return {function}
 */
function compressionMiddleware() {
  return compression();
};
