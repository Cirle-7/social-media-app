const router = require('express').Router();
const authenticate = require('../middleware/authentication')
const blockController = require('../controllers/blockController')



router.post('/block/:username', authenticate, blockController.blockUser)
router.delete('/unblock/:username', authenticate, blockController.unblockUser)
// router.get('/:username', authenticate, blockController.getUser);



module.exports = router;