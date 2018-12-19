'use strict';

const db = require('../../../database/redis');

module.exports = (id, message) => {
  return new Promise((resolve, reject) => {
    db.set('scheduledMessage:' + id, message, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};
