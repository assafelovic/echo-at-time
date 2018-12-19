'use strict';

const express = require('express');
const router = express.Router();

const { validate } = require('../middlewares');
const Joi = require('joi');

const MessagesController = require('../controllers/Messages');

router.post(
  '/schedule',
  validate({
    body: {
      time: Joi.date().required(),
      message: Joi.string().min(1).max(1000).required()
    }
  }),
  MessagesController.schedule);

router.post(
  '/schedule/now',
  validate({
    body: {
      message: Joi.string().min(1).max(1000).required()
    }
  }),
  (req, _, next) => {
    req.body.now = true;
    next();
  },
  MessagesController.schedule);

module.exports = router;
