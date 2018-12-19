'use strict';

const async = require('async');
const moment = require('moment');

const logger = require('../logger');
const db = require('../database/redis');

db.on('connect', () => run());

db.on('error', (error) => {
  logger.error(error);
  process.exit(-1);
});

const run = () => {
  produceQueue();
  consumeQueue();
};

// PRODUCING SCHEDULED MESSAGES TO QUEUE
const produceQueue = () => {
  async.forever(
    async () => {
      try {
        const listNames = await getListNames();
        for (const listName of listNames) {
          await queueMessagesFromList(listName);
          const isOld = moment(listName).isBefore(moment(), 'days');
          if (isOld) deleteList(listName);
        }
      } catch (error) {
        logger.error(error);
      }
    });
};

const getListNames = () => new Promise(
  (resolve) => {
    db.lrange('scheduledMessagesLists', 0, -1, (error, lists) => {
      if (error) {
        logger.error(error);
        return resolve([]);
      }

      resolve(
        lists
          .filter(list => moment(list).isSameOrBefore(moment(), 'days'))
          .sort((a, b) => moment(a).diff(b, 'days'))
      );
    });
  }
);

const queueMessagesFromList = (listName) => new Promise(
  (resolve) => {
    const listKey = 'scheduledMessages:' + listName;
    db.lrange(listKey, 0, -1, (error, items) => {
      if (error) {
        logger.error(error);
        return resolve();
      }

      async.eachLimit(
        items,
        10,
        async (item) => {
          try {
            const id = item.split(',')[1];
            const scheduledMessage = await getScheduledMessage(id);
            if (scheduledMessage) {
              let [time, ...message] = scheduledMessage.split(',');
              message = message.join(',');
              await pushScheduledMessageToQueue({ id, time, message });
              await removeScheduledMessageFromList(item, listKey);
            }
          } catch (error) {
            logger.error(error);
          }
        },
        () => resolve());
    });
  }
);

const getScheduledMessage = (id) => new Promise(
  (resolve) => {
    db.get('scheduledMessage:' + id, (error, item) => {
      if (error) {
        logger.error(error);
      }
      resolve(item);
    });
  }
);

const removeScheduledMessageFromList = (item, listKey) => new Promise(
  (resolve) => {
    db.lrem(listKey, 0, item, (error) => {
      if (error) logger.error(error);
      resolve();
    });
  }
);

const pushScheduledMessageToQueue = (scheduledMessage) => new Promise(
  (resolve) => {
    db.rpush(
      'scheduledMessagesQueue',
      Object.values(scheduledMessage).join(','),
      (error) => {
        if (error) {
          logger.error(error);
        }
        resolve();
      });
  }
);

const deleteList = (listName) => {
  const listKey = 'scheduledMessages:' + listName;
  db.lrem('scheduledMessagesLists', 0, listName, (error) => {
    if (error) logger.error(error);
  });
  db.del(listKey, (error) => {
    if (error) logger.error(error);
  });
};

// CONSUMING SCHEDULED MESSAGES FROM QUEUE
const consumeQueue = () => {
  async.forever(
    async () => {
      try {
        const scheduledMessage = await popScheduledMessage();
        if (scheduledMessage) {
          console.log(scheduledMessage.message);
          await pushScheduledMessageToProcessed(scheduledMessage);
        }
      } catch (error) {
        logger.error(error);
      }
    });
};

const popScheduledMessage = () => new Promise(
  (resolve) => {
    db.lpop('scheduledMessagesQueue', (error, scheduledMessage) => {
      if (error) {
        logger.error(error);
        return resolve(null);
      }

      if (!scheduledMessage) {
        return resolve(null);
      }

      let [id, time, ...message] = scheduledMessage.split(',');
      message = message.join(',');
      resolve({ id, time, message });
    });
  }
);

const pushScheduledMessageToProcessed = (scheduledMessage) => new Promise(
  (resolve) => {
    db.rpush(
      'processedMessages',
      Object.values(scheduledMessage).join(','),
      (error) => {
        if (error) {
          logger.error(error);
        }
        resolve();
      });
  }
);
