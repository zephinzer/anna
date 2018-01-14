const cors = require('cors');
const config = require('../config');

module.exports = cors({
  allowedHeaders: ['Content-Type', 'X-AuthKey', 'X-AuthToken'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  origin: (origin, callback) => {
    if (config.allowedOrigins === null) {
      callback(false);
    } else if (
      config.allowedOrigins.trim().length === 0 ||
      config.allowedOrigins.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      calllback(false);
    }
  },
});