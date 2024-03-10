const express = require('express');
const companyRoutes = require('./companyRoutes');
const employeeRoutes = require('./employeeRoutes');
const customersRoutes = require('./customersRoutes')
const loginRoutes = require('./loginRoutes');
const registerRoutes = require('./registerRoutes');
const controllers = require('../controllers');

const jwtMiddleware = require('../middleware/jwtMiddleware'); // Import JWT middleware

const routes = express.Router();

// Protected route (requires authentication)
// Home page route
routes.get('/home', jwtMiddleware, controllers.homeController.index);


routes.use('/login', loginRoutes); // Mount loginRoutes under /login path
routes.post('/logout', controllers.loginController.logoutUser);
routes.use('/register', registerRoutes); // Mount loginRoutes under /login path


routes.use('/:locale/company', jwtMiddleware, companyRoutes);
routes.use('/:locale/employee', jwtMiddleware, employeeRoutes);
routes.use('/:locale/customers', jwtMiddleware, customersRoutes);

module.exports = routes;
