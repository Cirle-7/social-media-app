const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morgan");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const profileRoute = require("./routes/profileRoute");
const followRoute = require("./routes/followRoute");
const accountRoute = require('./routes/accountRoute')
const blockRoute = require("./routes/blockRoute");
const commentRoute = require('./routes/commentRoute')
const passport = require("passport");
const cors = require("cors");
require("./utils/passportOAuth");

//import authentication
const authentication = require("./middleware/authentication");

//IMPLEMENT CORS
app.use(
  cors({
    credentials: true,
    origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'localhost',
    'https://test-social.vercel.app',
  ]
  })
);

//VIEWS
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("views"));

//REGISTER MORGAN MIDDLEWARE
app.use(morganMiddleware);

// PARSE REQUEST BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER
app.use(cookieParser());

// ROUTES
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use('/api/v1/account', accountRoute)
app.use("/api/v1/", followRoute);
app.use("/api/v1/user/", blockRoute);
app.use("/api/v1/post", authentication, postRoute);
app.use("/api/v1/comment", authentication, commentRoute)

//HOME ROUTE
app.get("/", (req, res) => {
  res.send(
    "welcome to the social media app \n <a href='/api/v1/users/auth/google'>Continue with Google</a> <a href='/api/v1/users/auth/github'>Continue with Github</a>"
  );
});

//CHNAGE REQUEST TIME FORMAT
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//HANDLE UNKNOWN REQUEST ERRORS
app.all("*", (req, res, next) => {
  return next(new appError(`${req.originalUrl} not found on this server`, 403));
});

//REGISTER GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
module.exports = app;
