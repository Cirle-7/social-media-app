require("express-async-errors");
const db = require("../models");
const Profile = db.profile
const AppError = require("../utils/appError");
const tokens = require("./../utils/tokens");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Email = require("./../utils/email");
// User model
const User = db.users;

//CREATE FUNCTION THAT HANDLES TOKEN RESPONSE & COOKIE RESPONSE
const createSendToken = async (user, statusCode, res) => {
  // CREATE JWT WITH MODEL INSTANCE
  const token = await user.createJwt();
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // SEND TOKEN TO CLIENT
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined

  res.status(statusCode).json({
    status: "Success",
    data: {
      user,
      token,
    },
  });
};

const signup = async (req, res) => {

  const { username, email, password, displayName } = req.body;

  // VALIDATE INPUT
  if (!(username && email && password && displayName))
    throw new AppError("All fields are required", 400);

  // CHECK IF USER ALREADY EXISTS
  const oldUser = await User.findOne({
    where: { email: email },
  });

  if (oldUser) throw new AppError("User already exists. Please login", 409);

  // CREATE USER IF NEW
  const user = await User.create(req.body);

  const defaultHeaderURL = 'https://cdn.pixabay.com/photo/2016/08/30/16/26/banner-1631296__340.jpg'
  const defaultAvatarURL = 'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg'



  await Profile.create({
    Bio:`hi, it's ${username} nice to meet you all`, 
    website:"", 
    github_link:"", 
    twitter_link:"", 
    location:req.location,
    avatarURL: defaultAvatarURL,
    headerURL: defaultHeaderURL,
    userId: user.id    
})
  try {
    //SEND WELCOME MAIL
    const url = `${req.protocol}://${req.get("host")}/api/v1/profiles/${user.username}`;
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
  // GET USER INPUT
  const { email, password } = req.body;

  // VALIDATE USER INPUT
  if (!(email && password)) throw new AppError("All fields are required", 400);

  // VALIDATE IF USER EXISTS IN DATABASE
  const user = await User.findOne({
    where: { email: email },
  });

  // CHECK IF USER ACCOUNT IS ALREADY DEACTIVATED
  if (user && user.deletionDate) {
    res.status(403).json({
      status: 'failed',
      message: `Your account is presently deactivated!`,
      activationUrl: `${req.protocol}://${req.get('host')}/api/v1/account/activate`
    })
  }

  //NOTIFY USERS WITH SOCIAL AUTH WHEN LOGGING IN
  if (user && !user.password)
    throw new AppError(
      "User already exists. Please login using your socials",
      401
    );

  // CHECK IF USER EXISTS WITHOUT LEAKING EXTRA INFOS
  if (!user || !(await user.comparePassword(password)))
    throw new AppError("Email Or Password Incorrect", 400);

  //CREATE TOKEN
  createSendToken(user, 200, res);
};


const updateDisplayName = async(req,res)=>{
  const {  body,params:{userId} } = req;

  const user = await User.findOne(
    { where: { id : userId } }
  );

  if(!user)throw new AppError('user doesnt exist')

  const updatedUser = await user.update(body)

  updatedUser.password = undefined

  res.status(200).json({
    status: "Success",
    data: {
      updatedUser
    },
  });



}

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

  try {
    const url = `${req.protocol}://${req.get("host")}/api/v1/users/login`;
    //4.SEND SUCCESS MAIL TO CLIENT
    await new Email(user, url).sendVerifiedPR();
    //5. LOG IN USER AND SEND JWT
    createSendToken(user, 200, res);
  } catch (err) {
    throw new AppError(
      "Password has been resetted, but we are having a issue sending a mail, Please proceed to login",
      500
    );
  }
};


module.exports = {
  signup,
  login,
  profile,
  createSendToken,
  forgotPassword,
  resetPassword,
  updateDisplayName,
};
