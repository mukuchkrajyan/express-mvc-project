const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// Получаем секретный ключ из переменной среды, если он определен, или используем значение по умолчанию
const secretKey = process.env.JWT_SECRET || 'YourSecretKeyHere';

function verifyToken(req, res, next) {
    // const token = req.header('Authorization');
    const token = req.cookies.token;
    // console.log("token in jwtMiddleware.js", token);
    if (!token) {
        console.log('Access denied');
        // return res.status(401).json({error: 'Access denied'});
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        // console.log(decoded);
        req.userId = decoded.userId;

        req.userRole = decoded.userRole;
        next();
    } catch (error) {
        console.log('Invalid token');
        // res.status(401).json({error: 'Invalid token'});
        return res.status(401).redirect('/login');
    }
};

module.exports = verifyToken;