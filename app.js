const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const config = require('./config');
const app = express();
const routes = require('./routes/routes');
const path = require('path');
const methodOverride = require('method-override');
const moment = require('moment');

global.xml_path = path.join(__dirname, 'public/xml');

const i18n = require("i18n");

i18n.configure({
    locales: config.translation.locales, // Add the locales you need
    defaultLocale: config.translation.defaultLocale,
    directory: __dirname + '/locales',
    objectNotation: true,
    replace: function (str, args) {
        return str.replace(/{{([^{}]*)}}/g, function (a, b) {
            return args[b];
        });
    },
});

const setLocale = require('./middleware/setLocale');
app.use(setLocale);

const translationHelper = require('./helpers/translationHelper');
const urlHelper = require('./helpers/urlHelper');

// Load and cache translations
const translations = translationHelper.loadTranslations();

const {detectLanguage} = require('./helpers/main');

// translations middleware
app.use((req, res, next) => {

    req.lang = config.translation.defaultLocale;
    const url = req.originalUrl;

    if (!url.match(/\.(js|css|jpg|jpeg|png|gif)$/)) {

        const lang = detectLanguage(req.url);

        req.lang = lang;
    }

    // Convert translations object into a format where keys are accessible as variable['key']
    // const translated = Object.assign({}, translations);
    const translated = translations[req.lang];

    res.locals.translated = translated;
    res.locals.generateUrl = urlHelper.generateUrl;

    // console.log("locals", res.locals);
    // console.log("translated",translated, translated['Customers']);
    next();
});

app.locals.moment = moment;
app.locals.shortDateFormat = "MM/DD/YYYY";
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
//app.use(myConnection(mysql,config.database,'pool'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(expressValidator());
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(flash());
app.use(bodyParser.json());
app.use('/', routes);
app.listen(3000, function () {
    console.log("App started at port 3000!!");
});