const sql = require('../db');
const moment = require("moment");
const util = require("util");
const queryAsync = util.promisify(sql.query).bind(sql);

class EmployeeModel {
    static async deleteEmployee(employeeId) {
        try {
            const result = await queryAsync("DELETE FROM employee WHERE id = ?", [employeeId]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async insertEmployee(newEmployee) {
        try {
            const result = await queryAsync("INSERT INTO employee SET ?", newEmployee);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async getAllEmployees() {
        try {
            const rows = await queryAsync("SELECT * FROM employee");
            console.log(rows);
            return rows;
        } catch (err) {
            throw err;
        }
    }

    static async getEmployeeById(employeeId) {
        try {
            const rows = await queryAsync("SELECT employee.*, company.name as company_name FROM employee LEFT JOIN company ON company.id = employee.company_id WHERE employee.id = ?", [employeeId]);
            if (rows.length <= 0) {
                return null;
            } else {
                return rows[0];
            }
        } catch (err) {
            throw err;
        }
    }

    static async updateEmployee(employeeId, employee) {
        try {
            const result = await queryAsync("UPDATE employee SET ? WHERE id = ?", [employee, employeeId]);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = EmployeeModel;
