const router = require('express').Router()
const followController = require('../controllers/followController')


router.post('/follow/:id', followController.follow);
router.post('/unfollow/:id', followController.unfollow);


module.exports = router