/**
 * Server application
 */

module.exports = server();

/**
 * exports the application server
 *
 * @return {express.server} Express server
 */
function server() {
  const express = require('express');

  const config = require('./config');
  const healthCheckController = require('./controllers/health-check');
  const readinessCheckController = require('./controllers/readiness-check');
  const todoController = require('./controllers/todo');
  const corsMiddleware = require('./middleware/cors');
  const morganMiddleware = require('./middleware/morgan');
  const bodyParserMiddleware = require('./middleware/body-parser');
  const helmetMiddleware = require('./middleware/helmet');
  const compressionMiddleware = require('./middleware/compression');
  const prometheusMiddleware = require('./middleware/prometheus');
  const basicAuthMiddleware = require('./middleware/basic-auth');
  const _server = express();

  // for server info stripping
  _server.use(helmetMiddleware);
  // for logging all requests
  _server.use(morganMiddleware);
  // for container orchestrators to check on service status
  _server.get(config.healthCheckEndpoint, healthCheckController);
  _server.get(config.readinessCheckEndpoint, readinessCheckController);
  // for handling cross origin resource sharing
  _server.use(corsMiddleware);
  // for handling response compression
  _server.use(compressionMiddleware);
  // for parsing JSON in post requests
  _server.use(bodyParserMiddleware.json);
  // for parsing URL query parameters
  _server.use(bodyParserMiddleware.urlencoded);
  // for prometheus metrics
  _server.use('/metrics', basicAuthMiddleware(), prometheusMiddleware());

  // application logic, see controllers for details
  _server.get('/session', todoController);
  _server.post('/session', todoController);
  _server.delete('/session', todoController);
  _server.get('/profiles', todoController);
  _server.get('/profile/:id', todoController);
  _server.patch('/profile/:id', todoController);
  _server.delete('/profile/:id', todoController);
  _server.post('/profile', todoController);
  _server.get('/user/:id', todoController);
  _server.get('/user/:id/profiles', todoController);
  _server.get('/user', todoController);
  _server.post('/user', todoController);
  _server.patch('/user', todoController);
  _server.delete('/user', todoController);

  // application error handlers
  _server.use((req, res) => {
    res.status(404).json('ok');
  });

  _server.use((err, req, res, next) => {
    if (config.env === 'development') {
      res.status(500).json(err);
    } else {
      res.status(500).json(err.message);
    }
  });

  return _server;
};
