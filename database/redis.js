'use strict';

const logger = require('../logger');
const config = require('../config');

let redis = require('redis');
if (config.get('env') === 'test') {
  redis = require('redis-mock');
}

const client = redis.createClient(config.get('db:redis'));

client.on('connect', () => {
  logger.info('Redis connected');
});

client.on('error', (error) => {
  logger.error(error);
  process.exit(-1);
});

module.exports = client;
