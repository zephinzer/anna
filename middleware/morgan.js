const morgan = require('morgan');

module.exports = morganMiddleware;

/**
 * Returns a Morgan access logging middleware for Express
 *
 * @return {function}
 */
function morganMiddleware() {
  return morgan(morganMiddleware.options);
};

morganMiddleware.options = 'common';
