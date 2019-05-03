const express = require('express');
const router = express.Router();

// const todoRoute = require('./todo.route');

const controller = require('../controllers/user/index.controller');
const todoController = require('../controllers/user/todo.controller');

router.get('/:id/todos', todoController.get);

router.put('/:id/todos', todoController.put);

router.get('/:id', controller.get);

module.exports = router;