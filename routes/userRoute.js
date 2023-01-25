const router = require('express').Router()
const authController = require('../controllers/authController')
const {userValidationMiddleware} = require('../validation/userValidation')
require('../utils/passportOAuth')
const passport = require('passport')

router.post('/signup', userValidationMiddleware, authController.signup)
router.post('/login', authController.login)

//GOOGLE OAUTH
router.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

router.get('/auth/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    console.log('Here now!');
    return res.redirect('/protected')
})

module.exports = router