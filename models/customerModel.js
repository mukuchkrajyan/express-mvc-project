const sql = require('../db');
const util = require('util');
const queryAsync = util.promisify(sql.query).bind(sql);

class CustomerModel {
    static async deleteItem(id) {
        try {
            const result = await queryAsync('DELETE FROM customers WHERE id = ?', [id]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async insertItem(item) {
        try {
            const result = await queryAsync('INSERT INTO customers SET ?', item);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async findItemById(id) {
        try {
            const rows = await queryAsync('SELECT * FROM customers WHERE id = ?', [id]);
            if (rows.length <= 0) {
                return null;
            }
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async getAllItems() {
        try {
            const rows = await queryAsync('SELECT * FROM customers');
            return rows;
        } catch (err) {
            throw err;
        }
    }

    static async searchItems(term) {
        try {
            const rows = await queryAsync('SELECT * FROM customers WHERE name LIKE ? or email like ? or description like ?', [`%${term}%`,`%${term}%`,`%${term}%`]);
            return rows;
        } catch (err) {
            throw err;
        }
    }

    static async updateItem(id, item) {
        try {
            const result = await queryAsync('UPDATE customers SET ? WHERE id = ?', [item, id]);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CustomerModel;
