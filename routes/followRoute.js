const router = require('express').Router()
const followController = require('../controllers/followController')
const authenticate = require('../middleware/authentication')
const { accessControl, authorizeAccessToPrivateAccount } = require('../middleware/accessControl')


router.post('/follow/:username', authenticate, authorizeAccessToPrivateAccount, accessControl, followController.follow);
router.delete('/unfollow/:username', authenticate, followController.unfollow);

//GET YOUR FOLLOWERS ROUTE
router.get('/followers',authenticate, followController.getFollowers)

//GET FOLLOWING ROUTE
router.get('/following', authenticate, followController.getFollowings)

//GET A USER FOLLOWERS ROUTE
router.get('/:user/followers', authenticate, followController.getUserFollowers)

//GET A USER FOLLOWS ROUTE

router.get('/:user/following', authenticate, followController.getUserFollows)


module.exports = router