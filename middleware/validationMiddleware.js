const yup = require('yup');

class ValidationMiddleware {
    async validate(req) {
        try {
            const schema = yup.object().shape({
                name: yup.string().required('Name is required.'),
                email: yup.string().email().required(),
                surname: yup.string().required(),
                age: yup.number().integer().required(),
                description: yup.string().required(),
                // Add more fields as needed
            });

            await schema.validate(req.body, { abortEarly: false });
            return null; // Validation passed, no errors
        } catch (validationError) {
            return validationError.errors;
        }
    }
}

module.exports = ValidationMiddleware;
