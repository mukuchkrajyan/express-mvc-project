const express = require('express');
const controllers = require('../controllers');

const customersRoutes = express.Router();

customersRoutes.all('/soap-parser', controllers.customersController.soapParser);
customersRoutes.post('/html-parser', controllers.customersController.htmlParser);

customersRoutes.post('/parse-xml', controllers.customersController.parseXml);
// customersRoutes.post('/generate-doc', controllers.customersController.generateDoc);
customersRoutes.post('/export-pdf-from-separate-html', controllers.customersController.generatePdfFromSeparateHtml);
customersRoutes.post('/export-pdf-from-html', controllers.customersController.generatePdfFromHtml);
customersRoutes.post('/generate-pdf', controllers.customersController.generatePdf);
customersRoutes.post('/export-excel', controllers.customersController.export);
customersRoutes.get('/', controllers.customersController.index);
customersRoutes.all('/search', controllers.customersController.search);
customersRoutes.get('/add', controllers.customersController.add);
// customersRoutes.post('/add', () => {}, controllers.customersController.save);
customersRoutes.post('/add', controllers.customersController.save);
customersRoutes.post('/view', controllers.customersController.customerDetail);
customersRoutes.get('/edit/(:id)', controllers.customersController.edit);
customersRoutes.post('/edit/(:id)', controllers.customersController.update);
customersRoutes.all('/delete/(:id)', controllers.customersController.delete);

module.exports = customersRoutes;