'use strict';

const moment = require('moment');

const logger = require('../../../logger');
const { v4: uuid } = require('../../../utils/uuid');

const storeMessage = require('./storeMessage');
const pushToList = require('./pushToList');
const registerList = require('./registerList');

module.exports = (time, message) => {
  const id = uuid();
  const date = moment(time).toDate().toISOString();
  const list = date.split('T')[0];

  (async () => {
    try {
      await storeMessage(id, [date, message].join(','));
      await pushToList(list, [date, id].join(','));
      await registerList(list);
    } catch (error) {
      logger.error(error);
    }
  })();

  return { id, date, message };
};
