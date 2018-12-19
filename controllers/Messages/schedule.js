'use strict';

const moment = require('moment');

const { NotAcceptableError, handleError } = require('../../errors');
const scheduleMessage = require('./methods/scheduleMessage');

module.exports = (req, res) => {
  try {
    const { message, now } = req.body;
    const time = now === true ? new Date() : req.body.time;

    const date = moment(time).toDate().toISOString();
    if (moment(date).isBefore(moment(), 'minutes')) {
      throw new NotAcceptableError('Time provided in request is older than now');
    }

    const scheduledMessage = scheduleMessage(time, message);
    res.status(200).send(scheduledMessage);
  } catch (error) {
    handleError(error, res);
  }
};
