const employeeModel = require('../models/employeeModel');
const companyModel = require('../models/companyModel');
const dateFormat = require('dateformat');

class EmployeeController {
    static async index(req, res, next) {
        try {
            const employees = await employeeModel.getAllEmployees();

            res.render('employee/index', { title: 'Employee Listing', employees: employees });
        } catch (err) {
            throw err;
        }
    }

    static async add(req, res, next) {
        try {
            const companies = await companyModel.getAllCompany();
            res.render('employee/add', { title: 'Add Employee', companies: companies });
        } catch (err) {
            throw err;
        }
    }

    static async save(req, res, next) {
        try {
            req.assert('name', 'Name is required.').notEmpty();
            req.assert('email', 'Email is required.').notEmpty();
            req.assert('company', 'Company must be selected.').notEmpty();
            req.assert('date_of_birth', 'Date of birth must not be empty.').notEmpty();
            req.assert('joining_date', 'Joining Date must not be empty.').notEmpty();

            const errors = req.validationErrors();

            if (!errors) {
                const newEmployee = {
                    name: req.sanitize('name').escape().trim(),
                    pic: 'no-user-pic.png',
                    email: req.sanitize('email').escape().trim(),
                    company_id: req.sanitize('company').escape().trim(),
                    date_of_birth: dateFormat(req.sanitize('date_of_birth').trim(), 'yyyy-mm-dd'),
                    joining_date: dateFormat(req.sanitize('joining_date').trim(), 'yyyy-mm-dd')
                };

                await employeeModel.insertEmployee(newEmployee);
                req.flash('success', 'Employee added successfully');
                res.redirect('/employee');
            } else {
                const err_msg = errors.map((err) => err.msg).join('<br/>');
                const companies = await companyModel.getAllCompany();
                req.flash('error', err_msg);
                res.render('employee/add', { title: 'Add Employee', companies: companies });
            }
        } catch (err) {
            req.flash('error', 'There was an error in inserting data');
            res.redirect('/employee');
        }
    }

    static async employeeDetail(req, res) {
        try {
            const employee_id = req.body.employee_id;
            const response = {};
            const result = await employeeModel.getEmployeeById(employee_id);

            if (result === null) {
                response.status = 0;
                response.data = {};
                response.message = "No employee details found";
            } else {
                response.status = 1;
                response.data = result;
                response.message = "Employee found";
            }

            res.send(JSON.stringify(response));
        } catch (err) {
            throw err;
        }
    }

    static async edit(req, res) {
        try {
            const employee_id = req.params.employee_id;
            const result = await employeeModel.getEmployeeById(employee_id);

            if (result === null) {
                req.flash('error', 'Sorry the employee does not exist!');
                res.redirect('/employee');
            } else {
                const companies = await companyModel.getAllCompany();
                res.render('employee/edit', {
                    title: 'Edit Employee',
                    employee_id: employee_id,
                    companies: companies,
                    employee: result[0]
                });
            }
        } catch (err) {
            throw err;
        }
    }

    static async update(req, res) {
        try {
            const employeeId = req.params.employee_id;
            req.assert('name', 'Name is required.').notEmpty();
            req.assert('email', 'Email is required.').notEmpty();
            req.assert('company', 'Company must be selected.').notEmpty();
            req.assert('date_of_birth', 'Date of birth must not be empty.').notEmpty();
            req.assert('joining_date', 'Joining Date must not be empty.').notEmpty();

            const errors = req.validationErrors();

            if (!errors) {
                const employee = {
                    name: req.sanitize('name').escape().trim(),
                    email: req.sanitize('email').escape().trim(),
                    company_id: req.sanitize('company').escape().trim(),
                    date_of_birth: companyModel.convertDate(req.sanitize('date_of_birth')),
                    joining_date: companyModel.convertDate(req.sanitize('joining_date')),
                    leaving_date: companyModel.convertDate(req.sanitize('leaving_date').escape().trim()),
                };

                const result = await employeeModel.updateEmployee(employeeId, employee);

                if (result.affectedRows === 1) {
                    req.flash('success', 'Item Information update successfully.');
                    res.redirect('/employee');
                } else {
                    req.flash('error', 'There was error in updating item.');
                    res.redirect('/employee/edit/' + employeeId);
                }
            } else {
                const err_msg = errors.map((err) => err.msg).join('<br/>');
                req.flash('error', err_msg);
                res.redirect('/employee/edit/' + companyId);
            }
        } catch (err) {
            throw err;
        }
    }

    static async delete(req, res) {
        try {
            const employeeId = req.params.employee_id;

            await employeeModel.deleteEmployee(employeeId);
            req.flash('success', 'Employee deleted successfully');
            res.redirect('/employee');
        } catch (err) {
            req.flash('error', 'There was an error in deleting data');
            res.redirect('/employee');
        }
    }
}

module.exports = EmployeeController;
