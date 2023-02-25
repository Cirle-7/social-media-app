const passport = require("passport");
const { Logform } = require("winston");
require("dotenv").config();
const Profile = require('../models/index').profile

require("express-async-errors");
const db = require("../models");
const User = db.users;

//OAuthController
const AppError = require("./appError");

const HOSTNAME = (process.env.NODE_ENV === 'production') ? 'https://circle7.tech' : `http://localhost:${process.env.PORT}`

//STRATEGIES
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GithubStrategy = require("passport-github2").Strategy;

// GOOGLE STARTEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${HOSTNAME}/api/v1/users/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {

      const googleDetails = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        username: profile.displayName,
      };

      if (!googleDetails) {
        const error = new AppError("User credentials are required!", 401);
        done(error);
      }

      // CHECK IF USER EXISTS OR CREATE USER
      try {
        const oldUser = await User.findOne({
          where: { googleId: googleDetails.googleId },
        });

        // IF OLDUSER IS DEACTIVATED
        if (oldUser && oldUser.deletionDate) {

          // IF OLDUSER IS DEACTIVATED BUT NOT ACCESSING SOCIALS FROM THE ACTIVATION ROUTE
          if (!req.cookies.activate) {

            const error = new AppError('Your account is presently deactivated!')
            error.activationUrl = `${req.protocol}://${req.get('host')}/api/v1/account/activate`

            return done(error)
          }

          await activateUser(oldUser)
          const token = await oldUser.createJwt();
          return done(null, { oldUser, token });
        }

        // IF USER EXISTS SEND USER WITH TOKEN
        if (oldUser) {
          const token = await oldUser.createJwt();
          return done(null, { oldUser, token });
        }

        // CREATE USER IF NEW
        const user = await User.create({ ...googleDetails });
        const token = await user.createJwt();

        // SEND THE USER AND THE TOKEN
        return done(null, { user, token });
      } catch (error) {
        done(error);
      }
    }
  )
);


// GITHUB STARTEGY
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${HOSTNAME}/api/v1/users/auth/github/callback`,

      scope: ['user:email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {

      const githubDetails = {
        githubId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,

        username: profile.username,
      };

      // CHECK IF USER EXISTS OR CREATE USER
      if (!githubDetails) {
        const error = new AppError("User credentials are required!", 401);
        done(error);
      }

      try {
        //check if user already exists
        const oldUser = await User.findOne({
          where: { githubId: githubDetails.githubId },
        });

        // IF OLDUSER IS DEACTIVATED
        if (oldUser && oldUser.deletionDate) {
          // IF OLDUSER IS DEACTIVATED BUT NOT ACCESSING SOCIALS FROM THE ACTIVATION ROUTE
          if (!req.cookies.activate) {

            const error = new AppError('Your account is presently deactivated!')
            error.activationUrl = `${req.protocol}://${req.get('host')}/api/v1/account/activate`

            return done(error)
          }

          await activateUser(oldUser)
          const token = await oldUser.createJwt();
          return done(null, { oldUser, token });
        }

        if (oldUser) {
          const token = await oldUser.createJwt();
          return done(null, { oldUser, token });
        }
        //Create user if new
        const user = await User.create({ ...githubDetails });
        const token = await user.createJwt();

        //send the user and token
        done(null, { user, token });
      } catch (error) {
        done(error);
      }
    }
  )
);


const activateUser = async (user) => {
  // ACTIVATE PROFILE
  await Profile.update(
    { isdeactivated: false },
    { where: { userId: user.id } }
  )
  // SET 'deletionDate' TO NULL
  user.deletionDate = null;
  await user.save()
}
