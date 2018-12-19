'use strict';

const db = require('../../../database/redis');

module.exports = (listName, data) => {
  return new Promise((resolve, reject) => {
    db.rpush('scheduledMessages:' + listName, data, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};
