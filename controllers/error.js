const config = require('../config');

module.exports = (err, req, res, next) => {
  if (config.env === 'development') {
    res.status(500).json(err);
  } else {
    res.status(500).json(err.message);
  }
};
