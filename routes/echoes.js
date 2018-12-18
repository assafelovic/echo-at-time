'use strict';

const express = require('express');
const router = express.Router();

const { validate } = require('../middlewares');
const Joi = require('joi');

const EchoesController = require('../controllers/Echoes');

router.post(
  '/',
  validate({
    body: {
      time: Joi.date().iso().required(),
      message: Joi.string().min(1).max(1000).required()
    }
  }),
  EchoesController.schedule);

module.exports = router;
