const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authentication')
const deleteController = require('../controllers/deleteController')

router.patch('/delete', authenticate, deleteController.deleteProfile)

router.patch('/deactivate/:token', authenticate, deleteController.deactivateProfile)

module.exports = router