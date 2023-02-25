const router = require('express').Router()
const authController = require('../controllers/authController')
const { userValidationMiddleware } = require('../validation/userValidation')
require('../utils/passportOAuth')
const passport = require('passport')
const { socialAuth } = require('../controllers/socialAuthController')
const { checkActivation } = require('../middleware/reqReferer')


//AUTHENTIACTION ROUTES
router.post("/signup", userValidationMiddleware, authController.signup);

router.post("/login", authController.login);

router.patch("/forgotpassword", authController.forgotPassword);

router.patch("/resetpassword/:token", authController.resetPassword);

//GOOGLE OAUTH
router.get('/auth/google', checkActivation, passport.authenticate('google', { scope: ['profile', 'email'] }))

//GITHUB OAUTH
router.get('/auth/github', checkActivation, passport.authenticate('github', { scope: ['user:email'] }))

//OAUTH CALLBACKS
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), socialAuth)

router.get('/auth/github/callback', passport.authenticate('github', { session: false }), socialAuth)


// LOGOUT - CLEAR COOKIE
router.get('/logout', (req, res, next) => {
     return res.clearCookie('jwt').redirect('/');
})

module.exports = router;
