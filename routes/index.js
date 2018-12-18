'use strict';

const express = require('express');
const router = express.Router();

router.use('/echoes', require('./echoes'));

module.exports = router;
