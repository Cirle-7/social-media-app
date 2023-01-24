const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("express-async-errors");

const logger = require("../utils/logger");
const db = require("../models");
const AppError = require("../utils/appError");

// User model
const User = db.users;

const signup = async (req, res) => {
  // console.log(req.headers)
  // logger.info(req.body)
  const { username, email, password, displayName } = req.body;

  // // validate input
  if (!(username && email && password && displayName))
    throw new AppError("All fields are required", 400);

  // check if user already exist
  const oldUser = await User.findOne({
    where: { email: email },
  });

  if (oldUser) throw new AppError("User already exists. Please login", 409);

  // if new user create
  const { body } = req;
  const user = await User.create({ ...body });

  // create jwt token with model instance
  const token = await user.createJwt();

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Send token to client
  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({
    status: "success",
    message: "signup successful",
    data: {
      user,
      token,
    },
  });
};

const login = async (req, res) => {
  // Get user input
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) throw new AppError("All fields are required", 400);

  // Validate if user exist in database
  const user = await User.findOne({
    where: { email: email },
  });

  // check if user exist
  if (!user) throw new AppError("Wrong email ", 400);

  //compare hashed password using model instance
  const isValid = await user.comparePassword(password);
  if (!isValid) throw new AppError("password is incorrect try again ", 400);

  // Create token
  const token = await user.createJwt();

  const cookieOptions = {
    expires: new Date(
      //   Date.now() + process.env.jwt_cookie_expires * 60 * 60 * 1000
      Date.now() + 1 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //Send Token To Client
  res.cookie("jwt", token, cookieOptions);

  // user
  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      userId: user.id,
      email: user.email,
      token,
    },
  });
};

// TO DO
// reset password
// forgot password
// logout?

module.exports = {
  signup,
  login,
};
