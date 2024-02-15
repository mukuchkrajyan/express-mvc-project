const xlsx = require('xlsx');

function readExcelFile(filePath) {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Assume you want to read the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to an array of objects
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    return jsonData;
}

module.exports = readExcelFile;

// console.log(jsonData);
