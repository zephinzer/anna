const helmet = require('helmet');

module.exports = helmetMiddleware;

/**
 * Returns a Helmet middleware component for Express
 *
 * @return {function}
 */
function helmetMiddleware() {
  return helmet();
};
