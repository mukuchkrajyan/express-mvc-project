const express = require('express');
const controllers = require('../controllers');

const companyRoutes = express.Router();

companyRoutes.get('/', controllers.companyController.index);
companyRoutes.get('/add', controllers.companyController.add);
companyRoutes.post('/add', controllers.companyController.save);
companyRoutes.get('/edit/(:id)', controllers.companyController.edit);
companyRoutes.post('/edit/(:id)', controllers.companyController.update);

module.exports = companyRoutes;