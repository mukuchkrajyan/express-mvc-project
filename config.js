require('dotenv').config();

const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'node_express'
    },
    translation: {
        locales: process.env.LOCALES ? process.env.LOCALES.split(',') : ['en', 'ru', 'am'],
        defaultLocale: process.env.DEFAULT_LOCALE || 'am'
    }
};

module.exports = config;
