const httpAuth = require('http-auth');
const config = require('../config');

module.exports = httpAuth.connect(httpAuth.basic({
  realm: config.realm,
}, (username, password, callback) => {
  callback((config.basicAuthUsers.findIndex(
    (user) => (
      user.username === username
      && user.password === password
    )) !== -1));
}));
