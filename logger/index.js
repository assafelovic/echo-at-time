'use strict';

const winston = require('winston');
const ConsoleTransport = winston.transports.Console;

const config = require('../config');

const transports = [];
const exceptionHandlers = [];

// Transport for logging to console
const consoleTransport = new ConsoleTransport({
  level: 'debug',
  colorize: true,
  humanReadableUnhandledException: true,
  timestamp: true
});
transports.push(consoleTransport);
exceptionHandlers.push(consoleTransport);

// Here goes custom transports
if (config.get('env') !== 'test') { // test environment should not use custom transports
  if (config.get('logger:sentry:enabled') === true) {
    const SentryTransport = require('winston-sentry');

    const sentrySettings = config.get('logger:sentry:settings');
    sentrySettings.tags.originator = process.env.originator ? process.env.originator : require('../package.json').name;
    sentrySettings.tags.version = process.env.version ? process.env.version : require('../package.json').version;
    sentrySettings.tags.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'not provided';

    const setryTransport = new SentryTransport(sentrySettings);
    transports.push(setryTransport);
    exceptionHandlers.push(setryTransport);
  }
}

// Creating logger instance
const
  logger = winston.createLogger({
    transports,
    exceptionHandlers,
    exitOnError: true,
    format: winston.format.simple()
  });

// express middleware for request logging
if (config.get('logger:request:enabled') === true) {
  const morgan = require('morgan');
  logger.request = morgan(
    config.get('logger:request:mode') || 'tiny',
    {
      stream: {
        write: logger.info
      }
    }
  );
}

module.exports = logger;
