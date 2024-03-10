// validationMiddlewareLogin.js
const yup = require('yup');

class ValidationMiddlewareLogin {
    async validate(req) {
        try {
            const schema = yup.object().shape({
                username: yup.string().required('Username is required.'),
                password: yup.string().required('Password is required.')
            });

            await schema.validate(req.body, { abortEarly: false });
            return null; // Validation passed, no errors
        } catch (validationError) {
            return validationError.errors;
        }
    }
}

module.exports = ValidationMiddlewareLogin;
