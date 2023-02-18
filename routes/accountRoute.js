const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authentication')
const accountController = require('../controllers/accountController')

router.patch('/delete', authenticate, accountController.requestDeactivation)

router.patch('/deactivate/:token', authenticate, accountController.deactivateProfile)

module.exports = router