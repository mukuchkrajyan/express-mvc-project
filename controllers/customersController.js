const ExchangeDataParser = require("../ExchangeDataServices/DataHtmlParser");
const customersModel = require("../models/customerModel");
const {parse} = require('url');
const path = require('path');

const ValidationMiddleware = require("../middleware/validationMiddleware");
const validationMiddleware = new ValidationMiddleware();
const exportUsersToExcel = require('../services/exportService');
const htmlToPdf = require('html-pdf');

const fs = require('fs');
const PDFDocument = require('pdfkit');

// const Docxtemplater = require('docxtemplater');
// const JSZip = require('jszip'); // Specify version 2 explicitly
// const mammoth = require('mammoth');
// const docx = require('docx');

const util = require('util');
const xml2js = require('xml2js');

const DataHtmlParser = require('../ExchangeDataServices/DataHtmlParser');
const SoapParser = require('../ExchangeDataServices/SoapParser');

class CustomersController {
    static async index(req, res, next) {
        try {
// console.log("CustomersController",res.locals);
            const items = await customersModel.getAllItems();
            res.render('customers/index', {
                title: 'Список клиентов',
                customers: items,
                userRole: req.userRole
            });
        } catch (err) {
            throw err;
        }
    }

    static async htmlParser(req, res, next) {
        try {

            const parser = new ExchangeDataParser();

            const filteredData = await parser.getAllIsoData();

            // Send the response
            res.json(filteredData);

        } catch (error) {
            console.error('Error parsing exchange Rates:', error);
        }
    }

    static async soapParser(req, res, next) {
        try {
            // Define SOAP request body
            const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ExchangeRatesLatest xmlns="http://www.cba.am/" />
      </soap:Body>
    </soap:Envelope>`;

// Define SOAP request options
            const options = {
                hostname: 'api.cba.am',
                port: 80,
                path: '/exchangerates.asmx',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'Content-Length': Buffer.byteLength(soapRequest),
                    'SOAPAction': '"http://www.cba.am/ExchangeRatesLatest"'
                },
                body: soapRequest
            };

// Create a new instance of SoapParser with options
            const soapParser = new SoapParser(options);

// Send SOAP request and parse response
            soapParser.sendRequest()
                .then((result) => {
                    const exchangeRatesLatestResult = result['soap:Envelope']['soap:Body'][0]['ExchangeRatesLatestResponse'][0]['ExchangeRatesLatestResult'][0];

                    const currentDate = exchangeRatesLatestResult['CurrentDate'][0];
                    const nextAvailableDate = exchangeRatesLatestResult['NextAvailableDate'][0];
                    const previousAvailableDate = exchangeRatesLatestResult['PreviousAvailableDate'][0];
                    const rates = exchangeRatesLatestResult['Rates'][0]['ExchangeRate'];


                    console.log('SOAP response:', result);
                    console.log('exchangeRatesLatestResult:', exchangeRatesLatestResult);
                    console.log('rates:', rates);


                    // Send the response
                    res.json(rates);

                    // Parse the response further as needed
                })
                .catch((error) => {
                    console.error('Error sending SOAP request:', error);
                });

        } catch (error) {
            console.error('Error parsing exchange Rates:', error);
        }
    }

    static async parseXml() {
        try {
            /*const xmlContent = `
    <root>
        <person>
            <name>John</name>
            <age>30</age>
        </person>
        <person>
            <name>Alice</name>
            <age>25</age>
        </person>
    </root>
`;

            // Parse XML content
            xml2js.parseString(xmlContent, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                } else {
                    console.log('Parsed XML:', util.inspect(result, {depth: Infinity}));
                }
            });*/
            // console.log(xml_path);
            // return false;
            // Alternatively, parse XML from a file
            const xmlFilePath = xml_path + '/example.xml'; // Path to your XML file
            fs.readFile(xmlFilePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading XML file:', err);
                } else {
                    // Parse XML file content
                    xml2js.parseString(data, (parseErr, parseResult) => {
                        if (parseErr) {
                            console.error('Error parsing XML file:', parseErr);
                        } else {
                            console.log('Parsed XML:', util.inspect(parseResult, {depth: Infinity}));

                            // Extract titles from the parsed XML object
                            const titles = parseResult.library.book.map(book => book.title[0]);

                            console.log(titles); // Output: ['The Great Gatsby', 'To Kill a Mockingbird', '1984']

                            return titles;
                        }
                    });
                }
            });

            /**/
        } catch (error) {
            console.error('Error parsing xml:', error);
        }
    }

    static async generatePdfFromSeparateHtml(req, res, next) {
        try {
            // Read HTML content from a separate file
            const htmlFilePath = path.join(__dirname, '../views/pdf/example.html'); // Replace with the actual path to your HTML file
            // const htmlFilePath = '../views/pdf/example.html';
            const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

            // Options for html-pdf conversion
            const pdfOptions = {
                format: 'Letter',
                border: '10mm',
                type: 'pdf',
            };

            // Convert HTML to PDF
            const htmlToPdfBuffer = await new Promise((resolve, reject) => {
                htmlToPdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            });

            // Set response headers for PDF file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

            // Pipe the HTML-to-PDF buffer to the response stream
            res.end(htmlToPdfBuffer);

        } catch (err) {
            // Handle errors
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }

    static async generatePdfFromHtml(req, res, next) {
        try {
            // HTML content to convert to PDF
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>PDF from HTML</title>
            </head>
            <body>
                <h1>Hello, PDFKit! it is customized text in html</h1>
                <p>This is a simple example of using pdfkit in Node.js to generate a PDF.</p>
            </body>
            </html>
        `;

            // Options for html-pdf conversion
            const pdfOptions = {
                format: 'Letter',
                border: '10mm',
                type: 'pdf',
            };

            // Convert HTML to PDF
            const htmlToPdfBuffer = await new Promise((resolve, reject) => {
                htmlToPdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            });

            // Set response headers for PDF file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

            // Pipe the HTML-to-PDF buffer to the response stream
            res.end(htmlToPdfBuffer);

        } catch (err) {
            // Handle errors
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }

    static async generatePdf(req, res, next) {
        try {
            // Create a PDF document
            const doc = new PDFDocument();

            // Set response headers for PDF file download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=example.pdf'); //for download
            // res.setHeader('Content-Disposition', 'inline; filename=example.pdf'); //for open in browser


            // Pipe the PDF content to the response stream
            doc.pipe(res);

            // Add content to the PDF
            doc.fontSize(16).text('Hello, PDFKit!', 100, 100);
            doc.fontSize(12).text('This is a simple example of using pdfkit in Node.js to generate a PDF.', 100, 150);

            // Finalize the PDF and end the response stream
            doc.end()

        } catch (err) {
            // Handle errors
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }

    static async search(req, res, next) {
        try {
            const parsedUrl = parse(req.url, true);
            const term = parsedUrl.query.term;

            const items = await customersModel.searchItems(term);
            res.render('customers/search', {title: 'Customers Listing', term: term, customers: items});
        } catch (err) {
            throw err;
        }
    }

    static async export(req, res, next) {

        const items = await customersModel.getAllItems();

        console.log(items);
        // var export_data = buildExportData(rows);
        var export_data = items;


        const workSheetColumnNames = [
            "ID",
            "Name",
            "Email",
            "Surname",
            "Age",
            "Description",
        ];

        const workSheetName = 'customers';

        const filePath = 'outputFiles/excel-from-js.xlsx';

        const fileName = 'customers.xlsx';

        try {
            exportUsersToExcel(export_data, workSheetColumnNames, workSheetName, filePath);

            res.download(filePath, fileName);
        } catch (err) {
            console.log(err.message);
        }

    }

    /**/

    static add(req, res, next) {
        res.render('customers/add', {title: 'Add customer', body: {}});
    }

    static async save(req, res) {

        console.log("hasanq");

        try {

            if (req.userRole !== "admin") {
                req.flash('error', 'You do not have permission to perform this action.');
                res.redirect('/' + res.locals.locale + '/customers/');
                return;
            }

            console.log("before validate");

            const errors = await validationMiddleware.validate(req);

            console.log("after validate", errors);

            if (!errors) {
                const item = {
                    name: req.sanitize('name').escape().trim(),
                    email: req.sanitize('email').escape().trim(),
                    surname: req.sanitize('surname').escape().trim(),
                    age: req.sanitize('age').escape().trim(),
                    description: req.sanitize('description').escape().trim(),
                };

                await customersModel.insertItem(item);
                req.flash('success', 'Customer added successfully');
                res.redirect('/customers');
            } else {

                var err_msg = "";
                errors.forEach(function (err) {
                    console.log(err);
                    err_msg += err + "<br/>";
                })

                console.log(err_msg);
                req.flash('error', err_msg);

                res.render('customers/add', {title: 'Add customer', body: req.body});
            }
        } catch (err) {
            req.flash('error', 'There was an error in inserting data');
            res.redirect('/customers');
        }
    }

    static async customerDetail(req, res) {
        try {
            const id = req.body.id;
            const response = {};
            const result = await customersModel.findItemById(id);

            if (result === null) {
                response.status = 0;
                response.data = {};
                response.message = "No item details found";
            } else {
                response.status = 1;
                response.data = result;
                response.message = "Item found";
            }

            res.send(JSON.stringify(response));
        } catch (err) {
            throw err;
        }
    }

    static async edit(req, res) {
        try {
            const id = req.params.id;
            const result = await customersModel.findItemById(id);

            const data = req.session.oldData || result; // Retrieve old data from the session

            // Clear the old data from the session after retrieving it
            req.session.oldData = null;

            console.log("data", data);
            // console.log(result);
            if (result === null) {
                req.flash('error', 'Sorry, the customer does not exist!');
                res.redirect('/customers');
            } else {
                res.render('customers/edit', {
                    title: 'Edit Customer',
                    customer: result,
                    data: data,
                });
            }
        } catch (err) {
            throw err;
        }
    }

    static async update(req, res) {
        try {

            if (req.userRole !== "admin") {
                req.flash('error', 'You do not have permission to perform this action.');
                res.redirect('/' + res.locals.locale + '/customers/');
                return;
            }

            const id = req.params.id;

            var basic_edit_url = '/' + res.locals.locale + '/customers/edit/';

            const errors = await validationMiddleware.validate(req);

            req.session.oldData = req.body;
            console.log("req.body", req.body);

            console.log(errors);
            // return false;
            if (!errors) {
                const customer = {
                    name: req.body.name.trim().toString(),
                    email: req.body.email.trim().toString(),
                    surname: req.body.surname.trim().toString(),
                    age: parseInt(req.body.age.trim()),
                    description: req.body.description.trim().toString(),
                };

                console.log(customer);
                const result = await customersModel.updateItem(id, customer);

                if (result.affectedRows === 1) {
                    req.flash('success', 'Customer information updated successfully.');
                    res.redirect('/' + res.locals.locale + '/customers');
                } else {
                    req.flash('error', 'There was an error in updating customer.');
                    res.redirect(basic_edit_url + id);
                }
            } else {
                console.log("before err_msg");
                const err_msg = errors.map((err) => err).join('<br/>');

                console.log(err_msg);
                req.flash('error', err_msg);
                res.redirect(basic_edit_url + id);
            }
        } catch (err) {
            throw err;
        }
    }

    static async delete(req, res) {
        try {
            const id = req.params.id;

            await customersModel.deleteItem(id);
            req.flash('success', 'Item deleted successfully');
            res.redirect('/customers');
        } catch (err) {
            req.flash('error', 'There was an error in deleting data');
            res.redirect('/customers');
        }
    }
}

module.exports = CustomersController;
