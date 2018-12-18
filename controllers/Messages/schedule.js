'use strict';

const { handleError } = require('../../errors');

const scheduleMessage = require('./methods/scheduleMessage');

module.exports = async (req, res) => {
  try {
    const { time, message } = req.body;
    const scheduledMessage = await scheduleMessage(time, message);
    res.status(200).send(scheduledMessage);
  } catch (error) {
    handleError(error, res);
  }
};
