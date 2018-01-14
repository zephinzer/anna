const db = require('../db');

module.exports = (req, res) => {
  if (Object.keys(db.error).length > 0) {
    res.status(500).json(db.error);
  } else {
    res.status(200).json('ok');
  }
};
