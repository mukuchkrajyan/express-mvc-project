const express = require('express');
const controllers = require('../controllers');

const loginRoutes = express.Router();

// Define login routes

loginRoutes.get('/', controllers.loginController.getLoginPage);
loginRoutes.post('/', controllers.loginController.loginUser);

module.exports = loginRoutes;
