// urlHelper.js

function generateUrl(locale, action) {
    return `/${locale}/${action}`;
}

module.exports = {
     generateUrl
};

