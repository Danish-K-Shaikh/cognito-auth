const express = require('express');
const router = express.Router();

const appRoutes = require('./app');
const authenticateUser = require('./authentication');
const userRoutes = require('./user');

router.use('/app', appRoutes);

router.use(authenticateUser);

router.use('/user', userRoutes);

module.exports = router;
