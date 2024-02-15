const i18n = require("i18n");

var homeController = function () {
}

homeController.index = function (req, res) {
    req.flash('success', i18n.__('Welcome to Home'))
    res.render('home/index', {title: 'Home page'});
}

module.exports = homeController