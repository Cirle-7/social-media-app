const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morgan");
const userRoute = require('./routes/userRoute')

//REGISTER MORGAN MIDDLEWARE
app.use(morganMiddleware);

// PARSE REQUEST BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER
app.use(cookieParser());

// ROUTES
app.use('/api/v1/users', userRoute)


//HOME ROUTE
app.get('/',(req,res)=>{
  res.send("wellcome to the social media app ")
})
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
