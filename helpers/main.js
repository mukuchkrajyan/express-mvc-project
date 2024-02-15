const config = require('../config');


// Detect language from URL path
function detectLanguage(url) {
    const locales = config.translation.locales;
    const parts = url.split('/');
    // Assuming the first segment of the URL path corresponds to the language/locale

    let locale = parts[1];

    if (!locales.includes(locale)) {
        locale = config.translation.defaultLocale;   // Default language
    }

    return locale;
}

// Example helper function to capitalize a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Example helper function to double a number
function double(num) {
    return num * 2;
}

// Export the helper functions
module.exports = {
    capitalize,
    double,
    detectLanguage,
};
