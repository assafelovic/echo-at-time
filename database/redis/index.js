'use strict';

const logger = require('../../logger');
const config = require('../../config');

let index = require('redis');
if (config.get('env') === 'test') {
  index = require('redis-mock');
}

const client = index.createClient(config.get('db:redis'));

client.on('connect', () => {
  logger.info('Redis connected');
});

client.on('error', (error) => {
  logger.error(error);
  process.exit(-1);
});

module.exports = client;
