const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("express-async-errors");
const logger = require("../utils/logger");
const db = require("../models");
const AppError = require("../utils/appError");
const tokens = require("./../utils/tokens");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Email = require("./../utils/email");
// User model
const User = db.users;

//CREATE FUNCTION THAT HANDLES TOKEN RESPONSE & COOKIE RESPONSE
const createSendToken = async (user, statusCode, res) => {
  // create jwt token with model instance
  const token = await user.createJwt();
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Send token to client
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "Success",
    data: {
      user,
      token,
    },
  });
};

const signup = async (req, res) => {
  const payload = {};

  const { username, email, password, displayName } = req.body;

  // // validate input
  if (!(username && email && password && displayName))
    throw new AppError("All fields are required", 400);

  //check if user already exist
  const oldUser = await User.findOne({
    where: { email: email },
  });

  if (oldUser) throw new AppError("User already exists. Please login", 409);

  // if new user create
  const user = await User.create(req.body);

  try {
    //SEND WELCOME MAIL
    const url = `${req.protocol}://${req.get("host")}/api/v1/profiles`;
    await new Email(user, url).sendWelcome();

    //CREATE TOKEN
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message:
        "Account Created Successfully, but we encountered an error sending a mail, Please login to continue!",
    });
  }
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

  // Check if user exists and email exist without leaking extra info
  if (!user || !(await user.comparePassword(password)))
    throw new AppError("Email Or Password Incorrect", 400);

  //CREATE TOKEN
  createSendToken(user, 200, res);
};

// SOCIAL SIGNUP OR LOGIN
const checkOrCreateOAuthUser = async (socialUser) => {
  // Validate user input
  if (!socialUser) throw new AppError("User credentials are required!", 400);

  //check if user already exists
  const oldUser = await User.findOne({
    where: { socialId: socialUser.socialId },
  });

  //Create user if new
  if (!oldUser) {
    const user = await User.create({ ...socialUser });
    if (!user) throw new AppError("Falied to create social user", 500);
  }

  return;
};

const profile = (req, res) => {
  res.render("profile");
};

//FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  //1. GET USER FROM EMAIL
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } });
  if (!user) throw new AppError("No User with that email", 404);

  //2. GENERATE RESET TOKEN & OTHER RETURNED VALUES
  const { resetToken, passwordToken, passwordResetExpires } =
    await tokens.createPasswordResetToken();

  //3. SAVE TO DATABASE
  const updatedUser = await User.update(
    {
      passwordToken: passwordToken,
      passwordResetExpires: passwordResetExpires,
    },
    { where: { email: email } }
  );

  //4. SEND TO CLIENT
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  try {
    //5. SEND EMAIL TO CLIENT
    await new Email(user, resetUrl).sendPasswordReset();

    //6. SEND JSON RESPONSE
    res.status(200).json({
      status: "success",
      message: `Token sent to mail ${resetUrl}`,
    });
    
  } catch (err) {
    throw new AppError("Error Sending Reset Link, Try Again!", 500);
  }
};

//RESET PASSWORD
const resetPassword = async (req, res, next) => {
  //1. CREATE A HASHED TOKEN FROM THE REQ PARAMS
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    where: {
      passwordToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });
  //2. CHECK IF TOKEN EXISTS OR THERE IS SUCH A USER
  if (!user)
    throw new AppError(
      "Token Expired Or Invalid Token, Request for a new token",
      403
    );

  //3. IF USER & TOKEN EXISTS, UPDATE THE NEW PASSWORD.
  user.password = req.body.password;
  user.passwordToken = null;
  user.passwordResetExpires = null;
  await user.save();

  //4. LOG IN USER AND SEND JWT
  createSendToken(user, 200, res);
};

module.exports = {
  signup,
  login,
  profile,
  checkOrCreateOAuthUser,
  createSendToken,
  forgotPassword,
  resetPassword,
};
