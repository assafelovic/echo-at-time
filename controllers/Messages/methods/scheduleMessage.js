'use strict';

const moment = require('moment');

const uuid = require('../../../utils/uuid');

const storeMessage = require('./storeMessage');
const pushToList = require('./pushToList');

module.exports = async (time, message) => {
  const id = uuid();
  const date = moment(time).toDate().toISOString();

  const messageKey = 'message:' + id;
  await storeMessage(messageKey, message);

  const messagesList = 'scheduledMessages:' + date.split('T')[0];
  await pushToList(messagesList, date + '|' + id);

  return { id, messageKey, messagesList, time, message };
};
