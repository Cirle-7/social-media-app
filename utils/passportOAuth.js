const passport = require("passport");
require("dotenv").config();

require("express-async-errors");
const db = require("../models");
const User = db.users;

//OAuthController
const AppError = require("./appError");


//STARTEGIES
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GithubStrategy = require("passport-github2").Strategy;

// GOOGLE STARTEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3310/api/v1/users/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {

      const googleDetails = {
        googleId: profile.id,

        displayName: profile.displayName,
        email: profile.email,
        username: profile.displayName,
      };

      // Check if user exist or Create user

      if (!googleDetails) {
        const error = new AppError("User credentials are required!", 401);
        done(error);
      }
      try {
        //check if user already exists
        const oldUser = await User.findOne({
          where: { googleId: googleDetails.googleId },
        });

    // IF USER EXISTS SEND USER WITH TOKEN
      if (oldUser) {
        const token = await oldUser.createJwt();
        return done(null, { oldUser, token });
      }
      //Create user if new
      const user = await User.create({ ...googleDetails });
      const token = await user.createJwt();

        //send the user and token
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
      callbackURL: "http://localhost:3310/api/v1/users/auth/github/callback",

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

      // Check if user exist or Create user

      // Check if user exist or Create user
      if (!githubDetails) {
        const error = new AppError("User credentials are required!", 401);
        done(error);
      }

      try {
        //check if user already exists
        const oldUser = await User.findOne({
          where: { githubId: githubDetails.githubId },
        });

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

