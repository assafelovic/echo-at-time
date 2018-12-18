'use strict';

const { NotImplementedError, handleError } = require('../../errors');

module.exports = (req, res) => {
  try {
    throw new NotImplementedError();
  } catch (error) {
    handleError(error, res);
  }
};
