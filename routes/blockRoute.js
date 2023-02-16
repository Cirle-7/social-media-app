const router = require('express').Router();
const authenticate = require('../middleware/authentication')
const blockController = require('../controllers/blockController')
const { accessControl } = require('../middleware/accessControl')



router.post('/block/:username', authenticate, blockController.blockUser)
router.delete('/unblock/:username', authenticate, blockController.unblockUser)
router.get('/:username', authenticate, accessControl, blockController.getUser);



module.exports = router;