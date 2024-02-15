const companyModel = require('../models/companyModel');
const ValidationMiddleware = require("../middleware/validationMiddleware");
const validationMiddleware = new ValidationMiddleware();

class CompanyController {
    static async index(req, res, next) {
        try {
            const companies = await companyModel.getAllCompany();

            // console.log(companies);return false;
            res.render('company/index', { title: 'Company Listing', companies: companies });
        } catch (err) {
            throw err;
        }
    }

    static add(req, res, next) {
        res.render('company/add', { title: 'Add Company' });
    }

    static async save(req, res) {
        try {
            req.assert('name', 'Name is required').notEmpty();
            req.assert('location', 'Location is required').notEmpty();

            const errors = req.validationErrors();

            if (!errors) {
                const newTask = {
                    name: req.sanitize('name').escape().trim(),
                    location: req.sanitize('location').escape().trim(),
                };

                await companyModel.insertCompany(newTask);
                req.flash('success', 'Company added successfully');
                res.redirect('/company');
            } else {
                const err_msg = errors.map((err) => err.msg).join('<br/>');
                req.flash('error', err_msg);
                res.render('company/add', { title: 'Add Company' });
            }
        } catch (err) {
            req.flash('error', 'There was an error in inserting data');
            res.redirect('/company');
        }
    }

    static async edit(req, res) {
        try {
            const companyId = req.params.id;
            const result = await companyModel.findCompanyById(companyId);

            console.log(companyId,result);
            if (result === null) {
                req.flash('error', 'Sorry, the company does not exist!');
                res.redirect('/company');
            } else {
                res.render('company/edit', { title: 'Edit Company', company: result });
            }
        } catch (err) {
            throw err;
        }
    }

    static async update(req, res) {
        try {
            const companyId = req.params.id;
            // req.assert('name', 'Name is required').notEmpty();
            // req.assert('location', 'Location is required').notEmpty();

            const errors = await validationMiddleware.validate(req);
            // const errors = req.validationErrors();

            if (!errors) {
                const company = {
                    name: req.sanitize('name').escape().trim(),
                    location: req.sanitize('location').escape().trim(),
                };

                const result = await companyModel.updateCompany(companyId, company);

                if (result.affectedRows === 1) {
                    req.flash('success', 'Company information updated successfully.');
                    res.redirect('/company');
                } else {
                    req.flash('error', 'There was an error in updating the company.');
                    res.redirect('/company/edit/' + companyId);
                }
            } else {
                const err_msg = errors.map((err) => err.msg).join('<br/>');
                req.flash('error', err_msg);
                res.redirect('/company/edit/' + companyId);
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CompanyController;
