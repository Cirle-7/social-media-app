const { auth } = require('express-openid-connect');
require('dotenv').config()

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

module.exports = auth(config)