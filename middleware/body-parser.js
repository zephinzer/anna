const bodyParser = require('body-parser');
const config = require('../config');

module.exports = {
  json: bodyParser.json(),
  urlencoded: bodyParser.urlencoded({
    extended: true,
  }),
};
