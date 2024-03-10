const express = require('express');
const controllers = require('../controllers');

const registerRoutes = express.Router();

// Define login routes
registerRoutes.get('/', controllers.registerController.getRegisterPage);
registerRoutes.post('/', controllers.registerController.registerUser);

module.exports = registerRoutes;
