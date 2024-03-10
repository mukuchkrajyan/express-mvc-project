const yup = require('yup');

class ValidationMiddleware {
    async validate(req) {
        try {
            const schema = yup.object().shape({
                name: yup.string().required('Name is required.'),
                email: yup.string().email().required(),
                company: yup.string().required(),
                date_of_birth: yup.number().integer().required(),
                joining_date: yup.string().required(),
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