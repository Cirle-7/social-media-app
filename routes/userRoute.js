const router = require('express').Router()
const authController = require('../controllers/authController')
const { userValidationMiddleware } = require('../validation/userValidation')
require('dotenv')
require('../utils/passportOAuth')
const passport = require('passport')
const { socialAuth } = require('../controllers/socialAuthController')
const { checkActivation } = require('../middleware/reqReferer')
const { getLocation } = require('../middleware/getLocationMW')


//AUTHENTIACTION ROUTES
router.post("/signup", userValidationMiddleware, getLocation, authController.signup);

router.patch("/:userId", authController.updateDisplayName)

router.post("/login", authController.login);

router.patch("/forgotpassword", authController.forgotPassword);

router.patch("/resetpassword/:token", authController.resetPassword);

//GOOGLE OAUTH
router.get('/auth/google', checkActivation, passport.authenticate('google'))

//GITHUB OAUTH
router.get('/auth/github', checkActivation, passport.authenticate('github'))


//OAUTH CALLBACKS
router.get('/auth/google/callback', passport.authenticate('google'), socialAuth)

router.get('/auth/github/callback', passport.authenticate('github'), socialAuth)


// LOGOUT - CLEAR COOKIE
router.get('/logout', (req, res, next) => {
     return res.clearCookie('jwt').redirect('/');
})

module.exports = router;
