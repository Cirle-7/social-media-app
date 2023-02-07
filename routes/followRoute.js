const router = require('express').Router()
const followController = require('../controllers/followController')
const authenticate = require('../middleware/authentication')

router.post('/follow/:id', authenticate, followController.follow);
router.post('/unfollow/:id', authenticate, followController.unfollow);


module.exports = router