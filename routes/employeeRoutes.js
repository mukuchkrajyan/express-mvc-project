const express = require('express');
const controllers = require('../controllers');

const employeeRoutes = express.Router();

employeeRoutes.get('/', controllers.employeeController.index);
employeeRoutes.get('/add', controllers.employeeController.add);
employeeRoutes.post('/add', controllers.employeeController.save);
employeeRoutes.post('/view', controllers.employeeController.employeeDetail);
employeeRoutes.get('/edit/(:employee_id)', controllers.employeeController.edit);
employeeRoutes.post('/edit/(:employee_id)', controllers.employeeController.update);
employeeRoutes.all('/delete/(:employee_id)', controllers.employeeController.delete);

module.exports = employeeRoutes;