'use strict';

process.env.originator = require('./package.json').name;
process.env.version = require('./package.json').version;

require('./database/redis');
const logger = require('./logger');
const config = require('./config');
const middlewares = require('./middlewares');
const express = require('express');
const app = express();

// APPLICATION BOOTSTRAP
app.set('trust proxy', 1);
app.use(middlewares.cors());
app.get('/', (req, res) => {
  res.status(200).send({
    type: 'service',
    name: process.env.originator
  });
});
app.use(middlewares.bodyParser.json({ limit: '1mb' }));
if (config.get('logger:request:enabled') === true) {
  app.use(logger.request);
}
app.use(require('./routes'));

// HANDLING UNHANDLED REQUEST ERRORS
const {
  NotFoundError,
  BadRequestError,
  SystemError,
  handleError
} = require('./errors');

app.use((req, res, _) => {
  handleError(new NotFoundError('Service endpoint does not exist'), res);
});

app.use((error, req, res, _) => {
  const { message } = error;
  if (message.indexOf('JSON')) {
    return handleError(new BadRequestError(message), res);
  }

  logger.warn(error.message);
  handleError(new SystemError(error.message), res);
});

module.exports = app;
