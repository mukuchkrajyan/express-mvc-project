const yup = require('yup');
const UserModel = require('../models/userModel');

class ValidationMiddlewareRegister {
    async validate(req) {
        try {
            // Define Yup schema for validation
            const schema = yup.object().shape({
                email: yup.string().required('Email is required.').test('unique', 'Email must be unique.',
                    async (value) => {

                        // Check if email already exists in the database
                        const existingUser = await UserModel.findByUsername(value);

                        console.log("email", value, existingUser);

                        let result;
                        if (existingUser) {
                            result = false; //validation error, user with current email exists
                        } else {
                            result = true; //true because user doesnt exist with current email
                        }
                        return result; // Return true if email is unique, false otherwise
                    }),

                password: yup.string().required('Password is required.'),
                firstName: yup.string().required('First name is required.'),
                lastName: yup.string().required('Last Name is required.')
            });

            // Validate request body against schema
            await schema.validate(req.body, {abortEarly: false});

            // If validation passes, return null (no errors)
            return null;
        } catch (error) {
            // If validation fails, return error messages
            return error.errors;
        }
    }
}

module.exports = ValidationMiddlewareRegister;
