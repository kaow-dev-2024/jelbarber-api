const express = require('express');

const auth = require('./auth');
const users = require('./users');
const branches = require('./branches');
const appointments = require('./appointments');
const payments = require('./payments');
const inventory = require('./inventory');
const transection = require('./transection');
const { response } = require('../app');

const router = express.Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/branches', branches);
router.use('/appointments', appointments);
router.use('/payments', payments);
router.use('/inventory', inventory);
router.use('/transection', transection);

module.exports = router;
