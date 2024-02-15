// middleware/setLocale.js

const { detectLanguage } = require('../helpers/main');

module.exports = function setLocale(req, res, next) {
    const locale = detectLanguage(req.url);
    res.locals.locale = locale;
    next();
};
