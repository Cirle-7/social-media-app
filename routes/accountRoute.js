const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authentication')
const passport = require('passport')
const accountController = require('../controllers/accountController')

router.patch('/delete', authenticate, accountController.requestDeactivation)

router.patch('/deactivate/:token', authenticate, accountController.deactivate)

router.get('/activate', (req, res) => { res.render('activateAccount')})

router.patch('/activate', accountController.activate)

module.exports = router