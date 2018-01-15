const httpAuth = require('http-auth');
const config = require('../config');

module.exports = basicAuthMiddleware;

/**
 * Initialises a Basic Auth middleware for use in an Express server.
 *
 * @param {IHttpAuth} iHttpAuth
 * @return {httpAuth.connect}
 */
function basicAuthMiddleware(iHttpAuth) {
  const authAdapter = iHttpAuth || httpAuth;
  return authAdapter.connect(authAdapter.basic(
    basicAuthMiddleware.options,
    basicAuthMiddleware.checker
  ));
};

basicAuthMiddleware.options = {
  realm: config.realm,
};

basicAuthMiddleware.checker = (username, password, callback) => {
  callback((config.basicAuthUsers.findIndex(
    (user) => (
      user.username === username
      && user.password === password
    )) !== -1));
};
