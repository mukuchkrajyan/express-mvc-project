const express = require('express');
const companyRoutes = require('./companyRoutes');
const employeeRoutes = require('./employeeRoutes');
const customersRoutes = require('./customersRoutes');
const controllers = require('../controllers');

const routes = express.Router();

// Home page route
routes.get('/', controllers.homeController.index);



routes.use('/:locale/company', companyRoutes);
routes.use('/:locale/employee', employeeRoutes);
routes.use('/:locale/customers', customersRoutes);

module.exports = routes;
