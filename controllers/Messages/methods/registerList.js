'use strict';

const db = require('../../../database/redis');

module.exports = (list) => new Promise(
  (resolve, reject) => {
    db.lrange('scheduledMessagesLists', 0, -1,
      (error, lists) => {
        if (error) return reject(error);
        if (lists.includes(list)) return resolve();

        db.rpush('scheduledMessagesLists', list,
          (error) => {
            if (error) return reject(error);
            resolve();
          });
      });
  }
);
