// validationMiddleware.js

const {body, validationResult} = require('express-validator');

const validationMiddleware = [
    // Validate 'name' field
    body('name').notEmpty().withMessage('Name is required'),

    // Validate 'email' field
    body('email').notEmpty().withMessage('Email is required'),

    // Validate 'email' field
    body('email').isEmail().withMessage('Please enter a valid email address'),
];

module.exports = {
    validationMiddleware,
    handleValidationErrors: (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render(
                'customers/edit', {
                    id: req.params.id,
                    title: 'Add New Customer',
                    name: req.body.name,
                    email: req.body.email,
                    errors: errors.array(),
                });
        }

        next(); // Continue to the next middleware or route handler
    },
};
