// helpers/translationHelper.js

const fs = require('fs');
const config = require('../config');

function loadTranslations() {
    const translations = {};
    const locales = config.translation.locales; // List of supported languages
    locales.forEach(locale => {
        translations[locale] = JSON.parse(fs.readFileSync(`./locales/${locale}.json`, 'utf8'));
    });
    return translations;
}

module.exports = {
    loadTranslations
};
