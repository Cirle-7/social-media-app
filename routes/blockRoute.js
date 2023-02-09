const router = require('express').Router();
const authenticate = require('../middleware/authentication')
const blockController = require('../controllers/blockController')



router.post('/block/:id', authenticate, blockController.blockUser)
router.delete('/unblock/:id', authenticate, blockController.unblockUser)
router.get('/:userId', authenticate, blockController.getUser);





module.exports = router;