const yup = require('yup');

class ValidationMiddlewareCompany {
    async validate(req) {
        try {
            const schema = yup.object().shape({
                name: yup.string().required('Name is required.'),
                location: yup.string().required('Location is required.'),
                // Add more fields as needed
            });

            await schema.validate(req.body, {abortEarly: false});
            return null; // Validation passed, no errors
        } catch (validationError) {
            return validationError.errors;
        }
    }
}

module.exports = ValidationMiddlewareCompany;
