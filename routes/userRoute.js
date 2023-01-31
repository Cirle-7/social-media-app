const router = require('express').Router()
const authController = require('../controllers/authController')
const { userValidationMiddleware } = require('../validation/userValidation')
require('../utils/passportOAuth')
const passport = require('passport')
const {socialAuth}  = require('../controllers/socialAuthController')





router.post('/signup', userValidationMiddleware, authController.signup)
router.post('/login', authController.login)

//GOOGLE OAUTH
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

//GITHUB OAUTH
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email']}))

//OAUTH CALLBACKS
router.get('/auth/google/callback', passport.authenticate('google',{session:false, failureRedirect: '/'}),socialAuth)

router.get('/auth/github/callback', passport.authenticate('github',{session:false, failureRedirect: '/'}),socialAuth)

// LOGOUT - DESTROY SESSION
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        return res.redirect('/')
    })
})

module.exports = router