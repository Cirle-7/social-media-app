const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morgan");
const userRoute = require('./routes/userRoute')
const session = require('express-session');
const passport = require("passport");
require('./utils/passportOAuth')

//VIEWS
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('views'))

//REGISTER MORGAN MIDDLEWARE
app.use(morganMiddleware);

// PARSE REQUEST BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
})
);

// TODO:
// CHECK IF USER IS LOGGED IN
const checkAuth = (req, res, next) => {
  if(!req.session.passport.user) return res.redirect('/')
  return next()
}

// ROUTES
app.use('/api/v1/users', userRoute)


//HOME ROUTE
app.get('/',(req,res)=>{
  res.send("welcome to the social media app \n <a href='/api/v1/users/auth/google'>Continue with Google</a> <a href='/api/v1/users/auth/github'>Continue with Github</a>")
})

//CHNAGE REQUEST TIME FORMAT
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// TODO:
app.get('/protected', checkAuth, (req, res) => {
  res.send('Hello!')
})

// LOGOUT - DESTROY SESSION
app.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
})

//HANDLE UNKNOWN REQUEST ERRORS
app.all("*", (req, res, next) => {
  return next(new appError(`${req.originalUrl} not found on this server`, 403));
});

//REGISTER GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
module.exports = app;
