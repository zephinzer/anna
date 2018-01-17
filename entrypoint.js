const config = require('./config');

const server = require('./server');

server().listen(config.port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`- - -\nserver listening on http://127.0.0.1:${config.port}/`);
    const db = require('./db');
    db.init();
  }
});
