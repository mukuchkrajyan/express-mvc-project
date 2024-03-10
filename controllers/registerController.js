// controllers/registerController.js
const UserModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const ValidationMiddlewareRegister = require('../middleware/validationMiddlewareRegister');
const validationMiddlewareRegister = new ValidationMiddlewareRegister();

class RegisterController {
    static async getRegisterPage(req, res) {
        res.render('register');
    }

// Function to hash passwords
    static async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10); // Generate salt with a cost factor of 10
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    }

    static async registerUser(req, res) {
        try {

            const errors = await validationMiddlewareRegister.validate(req);

            if (errors) {
                console.log("Validation errors:", errors);
                return res.render('register', {title: 'Register', errors: errors, old: req.body});
            }

            // Extract form data
            const {firstName, lastName, email, password} = req.body;

            // Hash the password
            const hashedPassword = await RegisterController.hashPassword(password);

            let photo = null;

            // Handle file upload
            if (req.files && req.files.photo) {
                const photoFile = req.files.photo;
                const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

                // Ensure the uploads directory exists
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, {recursive: true});
                }

                // Generate a unique filename for the uploaded photo
                const photoName = Date.now() + '-' + photoFile.name;
                const photoPath = path.join(uploadDir, photoName);

                // Move the uploaded file to the specified directory
                await photoFile.mv(photoPath);

                // Set the photo filename
                photo = photoName;
            }

            // Save user data to the database
            await RegisterController.saveToDatabase(firstName, lastName, email, hashedPassword, photo);

            // Redirect or render success page after registration
            req.flash('success', 'You have successfully registered');
            res.render('login', {title: 'Login'});
        } catch (error) {
            console.error('Error registering user:', error);
            req.flash('error', 'An error occurred during user registration');
            res.render('register', {title: 'Register'});
        }
    }

    static async saveToDatabase(firstName, lastName, email, password, photoName = null) {
        try {

            console.log("saveToDatabase", firstName, lastName, email, password, photoName);

            // Create a new user object with the provided data
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                photo: photoName // Assuming you have a 'photo' field in your User model
            };

            // Save the user to the database
            await UserModel.insert(newUser);

            console.log('User saved to database:', newUser);
        } catch (error) {
            console.error('Error saving user to database:', error);
            throw error;
        }
    }

}

module.exports = RegisterController;
