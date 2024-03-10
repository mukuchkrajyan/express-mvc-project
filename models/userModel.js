// userModel.js
const sql = require('../db');
const util = require("util");


const queryAsync = util.promisify(sql.query).bind(sql);
const bcrypt = require('bcrypt');

class UserModel {
    static async findByUsername(username) {
        try {

            const rows = await queryAsync('SELECT * FROM users WHERE email = ?', [username]);
            return rows[0] || null;
        } catch (err) {
            throw err;
        }
    }

    static findById(id) {

        var result = null;

        const rows = sql.query('SELECT * FROM users WHERE id = ?', [id], (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
            } else {
                result = results[0];
            }

            console.log('Query results:', results);
            console.log('result', result);
            return result;
        });


        return result;
    }

    static async findByCredentials(username, password) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            console.log(user, rows);
            return false;
            if (!user) {
                return null; // User not found
            }

            // Compare the hashed password with the provided password
            const passwordMatch = comparePassword(password, user.passwordHash);
            if (!passwordMatch) {
                return null; // Passwords don't match
            }

            return user; // Return the user object
        } catch (err) {
            throw err;
        }
    }

    static async authenticate(username, password) {
        try {
            const user = await this.findByUsername(username);
            if (!user) {
                return null; // User not found
            }
            // Compare hashed password
            const match = await bcrypt.compare(password, user.password);
            return match ? user : null;
        } catch (err) {
            throw err;
        }
    }

    static async createUser(username, password) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert user into the database
            const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
            return result.insertId;
        } catch (err) {
            throw err;
        }
    }

    static async insert(item) {
        try {
            const result = await queryAsync("INSERT INTO users SET ?", item);
            const filledSql = `${result} ${JSON.stringify(item)}`; // Combine SQL query with parameters
            console.log('Filled SQL Query:', filledSql); // Log the filled SQL query

            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = UserModel;
