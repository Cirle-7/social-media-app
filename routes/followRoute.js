const router = require('express').Router()
const followController = require('../controllers/followController')
const authenticate = require('../middleware/authentication')
const { accessControl, authorizeAccessToPrivateAccount } = require('../middleware/accessControl')


router.post('/follow/:username', authenticate, authorizeAccessToPrivateAccount, accessControl, followController.follow);
router.delete('/unfollow/:username', authenticate, followController.unfollow);



module.exports = router