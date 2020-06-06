const express = require('express');
const router = express.Router();

const home = require('./modules/home');
const todos = require('./modules/todos');
const users = require('./modules/users');
const auth = require('./modules/auth');
//import middleware function
const { authenticator } = require('../middleware/auth');

router.use('/todos', authenticator, todos);
router.use('/users', users);
router.use('/auth', auth);
router.use('/', authenticator, home); //the shortest route should be put the last

module.exports = router;
