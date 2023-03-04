const router = require('express').Router()
const privateController = require('../controllers/privateController')
const authenticate = require('../middleware/authentication')


router.patch('/private', authenticate, privateController.makePrivate);
router.patch('/public', authenticate, privateController.makePublic);


module.exports = router