'use strict';

const db = require('../../../database/redis');

module.exports = (messageKey, message) => {
  return new Promise((resolve, reject) => {
    db.set(messageKey, message, (error) => {
      if (error) {
        return reject(error.message);
      }
      resolve();
    });
  });
};
