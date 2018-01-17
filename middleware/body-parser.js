const bodyParser = require('body-parser');

module.exports = {
  json: () =>
    bodyParser.json(),
  urlencoded: () =>
    bodyParser.urlencoded({
      extended: true,
    }),
};
