const http = require('http');
const xml2js = require('xml2js');

class SoapParser {
    constructor(options) {
        this.options = options;
    }

    sendRequest() {
        return new Promise((resolve, reject) => {
            const req = http.request(this.options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    // Parse SOAP response
                    xml2js.parseString(data, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            // Send SOAP request body
            req.write(this.options.body);
            req.end();
        });
    }
}

module.exports = SoapParser;
