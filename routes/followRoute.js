const router = require('express').Router()
const followController = require('../controllers/followController')
const authenticate = require('../middleware/authentication')

router.post('/follow/:username', authenticate, followController.follow);
router.delete('/unfollow/:username', authenticate, followController.unfollow);



module.exports = router