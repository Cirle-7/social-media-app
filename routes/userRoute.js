const router = require('express').Router()
const authController = require('../controllers/authController')
const {userValidationMiddleware} = require('../validation/userValidation')

router.post('/signup', userValidationMiddleware, authController.signup)
router.post('/login', authController.login)


module.exports = router