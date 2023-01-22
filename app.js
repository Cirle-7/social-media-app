const express = require("express");
const app = express();
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morgan");
const { requiresAuth } = require('express-openid-connect')
const authConfig  = require('./utils/auth0')
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({ extended: false }))

// auth configuration
app.use(authConfig);

//REGISTER MORGAN MIDDLEWARE
app.use(morganMiddleware);

//CHNAGE REQUEST TIME FORMAT
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.send( 'Welcome to our app')
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send( req.oidc.user ? 'Welcome': 'Login')
});

//HANDLE UNKNOWN REQUEST ERRORS
app.all("*", (req, res, next) => {
  return next(new appError(`${req.originalUrl} not found on this server`, 403));
});

//REGISTER GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
module.exports = app;
