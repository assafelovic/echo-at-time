'use strict';

// LOADING NECESSARY PACKAGES & COMPONENTS
const http = require('http');
const config = require('./config');
const app = require('./app');
const logger = require('./logger');

// IF HTTP ENABLED LISTEN WITH HTTP MODULE
const listenHost = config.get('http:host');
const listenPort = config.get('http:port');
const httpServer = http.createServer(app);

httpServer.listen(listenPort, listenHost,
  () => logger.info('App listening at http://%s:%s', listenHost, listenPort));
