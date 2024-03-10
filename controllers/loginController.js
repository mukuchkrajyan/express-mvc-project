const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const ValidationMiddlewareLogin = require('../middleware/validationMiddlewareLogin');
const validationMiddlewareLogin = new ValidationMiddlewareLogin();

class LoginController {
    static async getLoginPage(req, res, next) {
        try {
            res.render('login', { title: 'Login' });
        } catch (err) {
            throw err;
        }
    }

    static async loginUser(req, res, next) {
        try {
            const errors = await validationMiddlewareLogin.validate(req);

            if (!errors) {
                const { username, password } = req.body;

                // Perform authentication logic here
                const user = await UserModel.authenticate(username, password);

                if (user) {
                    // Generate JWT token
                    /*const token = jwt.sign({ id: user.id },
                        process.env.JWT_SECRET,
                        {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                        });*/

                    const token = jwt.sign({ userId: user.id,userRole:user.role }, process.env.JWT_SECRET, {
                        expiresIn: '1h',
                    });

                    // Set token in response header
                    res.set('Authorization', `Bearer ${token}`);
                    res.setHeader('Authorization', `Bearer ${token}`);

                    console.log("token in logincontroller",token);
                    res.cookie('token', token, { httpOnly: true }); // Сохраняем токен в куках

                    // Redirect to dashboard or desired route
                    res.redirect('/home');
                } else {
                    // Authentication failed, redirect back to login with error message
                    res.render('login', { title: 'Login', error: 'Invalid username or password' });
                }
            } else {
                // Validation errors, render login page with errors
                res.render('login', { title: 'Login', errors });
            }
        } catch (err) {
            // Handle errors
            throw err;
        }
    }

    static async logoutUser(req, res, next) {

        console.log("logoutUser");

        try {
            // Clear token from cookies
            res.clearCookie('token');

            // Optionally, remove the token from response headers if set
            // res.removeHeader('Authorization');

            // Redirect user to login page or any other desired page
            res.redirect('/login');
        } catch (err) {
            // Handle errors
            next(err);
        }
    }

}

module.exports = LoginController;
