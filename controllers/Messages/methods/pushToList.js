'use strict';

const db = require('../../../database/redis');

module.exports = (messagesList, data) => {
  return new Promise((resolve, reject) => {
    db.lpush(messagesList, data, (error) => {
      if (error) {
        return reject(error.message);
      }
      resolve();
    });
  });
};
