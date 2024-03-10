const companyModel = require('../models/companyModel');
const UserModel = require('../models/userModel');
const validationMiddlewareCompany = require("../middleware/validationMiddlewareCompany");
const validator = new validationMiddlewareCompany();

class CompanyController {

    static async index(req, res, next) {

        // console.log("current userRole is", req.userRole);
        try {
            const companies = await companyModel.getAllCompany();

            // console.log(companies);return false;
            res.render('company/index', {title: 'Company Listing', companies: companies,
                userRole: req.userRole});
        } catch (err) {
            throw err;
        }
    }

    static editAction(req, res) {
        return '/' + res.locals.locale + '/company/edit/';
    }

    static add(req, res, next) {
        res.render('company/add', {title: 'Add Company'});
    }

    static async save(req, res) {
        try {
            // Check if userRole is admin
            if (req.userRole !== "admin") {
                req.flash('error', 'You do not have permission to perform this action.');
                res.redirect('/' + res.locals.locale + '/company/');
                return;
            }

            const errors = await validator.validate(req);

            if (!errors) {
                const company = {
                    name: req.body.name.trim(),
                    location: req.body.location.trim(),
                };

                await companyModel.insertCompany(company);

                req.flash('success', 'Company added successfully');
                res.redirect('/' + res.locals.locale + '/company/' );
            } else {
                let err_msg = '';
                errors.forEach((error) => {
                    err_msg += error + '<br/>';
                });

                console.log(err_msg,errors);
                req.flash('error', err_msg);
                res.render('/' + res.locals.locale + '/company/add', {title: 'Add Company'});
            }
        } catch (err) {
            req.flash('error', 'There was an error in inserting data');
            res.redirect('/' + res.locals.locale + '/company/' );
        }
    }

    static async edit(req, res) {
        try {
            const companyId = req.params.id;
            const result = await companyModel.findCompanyById(companyId);

            console.log(companyId, result);
            if (result === null) {
                req.flash('error', 'Sorry, the company does not exist!');
                res.redirect(this.listingAction);
            } else {
                res.render('company/edit', {title: 'Edit Company', company: result});
            }
        } catch (err) {
            throw err;
        }
    }

    static async update(req, res) {
        try {

            if (req.userRole !== "admin") {
                req.flash('error', 'You do not have permission to perform this action.');
                res.redirect('/' + res.locals.locale + '/company/');
                return;
            }

            const companyId = req.params.id;

            const errors = await validator.validate(req);

            if (!errors) {
                const company = {
                    name: req.body.name.trim(),
                    location: req.body.location.trim(),
                };

                const result = await companyModel.updateCompany(companyId, company);

                var msg;
                if (result.affectedRows === 1) {
                     msg = 'Company information updated successfully.';

                } else {
                     msg = 'Nothing changed';
                }

                req.flash('success', msg);
                res.redirect('/' + res.locals.locale + '/company/edit/' + companyId);

            } else {
                let err_msg = '';
                errors.forEach((error) => {
                    err_msg += error + '<br/>';
                });

                req.flash('error', err_msg);
                res.redirect('/' + res.locals.locale + '/company/edit/' + companyId);
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CompanyController;
