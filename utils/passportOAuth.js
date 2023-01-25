const passport = require('passport')
require('dotenv').config()

const GoogleStrategy = require('passport-google-oauth2').Strategy


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3310/api/v1/users/auth/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {

    console.log(profile)
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        //username
    }
    done(null, profile)
}
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})