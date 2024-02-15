// validationMiddleware.js

const { body, validationResult } = require('express-validator');

var currentAction;


// const validationMiddleware = (action) => [
//
//
//     // Validate 'name' field
//     body('name').notEmpty().withMessage('Name is required'),
//
//     // Validate 'email' field
//     body('email').notEmpty().withMessage('Email is required'),
//
//     // Validate 'email' field
//     body('email').isEmail().withMessage('Please enter a valid email address'),
// ] ;

const validationMiddleware = (action) => {
    currentAction = action; // Set the current action
    return [
        // Validate 'name' field
        body('name').notEmpty().withMessage('Name is required'),

        // Validate 'email' field
        body('email').notEmpty().withMessage('Email is required'),

        // Validate 'email' field
        body('email').isEmail().withMessage('Please enter a valid email address'),
    ];
};

console.log(validationMiddleware);
module.exports = {
    validationMiddleware,
    handleValidationErrors: (req, res, next) => {
        const errors = validationResult(req);

        // console.log(req.params, res, next);
        console.log(currentAction,"hasanq");

        if (!errors.isEmpty()) {
            // return res.render('', {
            //     title: 'Add New Customer',
            //     name: req.body.name,
            //     email: req.body.email,
            //     errors: errors.array(),
            // });
        }

        next(); // Continue to the next middleware or route handler
    },
};
