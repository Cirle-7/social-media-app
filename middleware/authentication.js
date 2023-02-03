const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
require("express-async-errors");
const db = require('../models')
//IMPORT USER MODEL
const User = db.users
require('dotenv').config()

const authorize = async (req, res, next) => {
  /** testing authorization**/
  let token;
  if (process.env.NODE_ENV === "development") {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new AppError("You are not logged in, Please Login Again", 403);

    //Save token from authHeader if available
    token = authHeader.split(" ")[1];
  } else if (process.env.NODE_ENV === "production") {
    const cookieValue = req.cookies.jwt;
    if (!cookieValue)
      throw new AppError("You are not logged in, Please Login Again", 403);

    //SAVE TOKEN FROM COOKIE
    token = req.cookies.jwt;
  }

  // verify token
  const verifyToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  
  //Check if user exists, we do this because verification was sucessful
  const currentUser = await User.findOne({
    where: { id: verifyToken.user_id },
  });

  if (!currentUser)
    throw new AppError(404, "Account Not Found, Please Login again!");

  //Add user to req object
  req.user = currentUser;
  next();
};

module.exports = authorize;
