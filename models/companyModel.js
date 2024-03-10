const sql = require('../db');
const moment = require("moment");
const util = require("util");
const queryAsync = util.promisify(sql.query).bind(sql);

class CompanyModel {
    static async getAllCompany() {
        try {
            const result = await queryAsync("SELECT * FROM company");

            // console.log(result);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async insertCompany(newCompany) {
        try {
            const result = await sql.query("INSERT INTO company SET ?", newCompany);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async findCompanyById(companyId) {
        try {
            const rows = await queryAsync("SELECT * FROM company WHERE id = ?", [companyId]);

            if (rows.length <= 0) {
                return null;
            } else {

                // console.log("findCompanyById",rows[0],rows[0].id);
                return rows[0];
            }
        } catch (err) {
            throw err;
        }
    }

    static async updateCompany(companyId, company) {
        try {
            console.log("updateCompany",companyId, company);
            const result = await sql.query("UPDATE company SET ? WHERE id = ?", [company, companyId]);
            return result;
        } catch (err) {
            console.log("err",err);
            throw err;
        }
    }

    static convertDate(originalDateString) {
        if (originalDateString.trim().length === 0) {
            return null;
        }

        // Parse the date string using moment
        const parsedDate = moment(originalDateString, 'MM/DD/YYYY');

        // Format the date as a string in MySQL format (YYYY-MM-DD)
        const formattedDate = parsedDate.format('YYYY-MM-DD');

        return formattedDate;
    }
}

module.exports = CompanyModel;
