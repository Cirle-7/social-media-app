const router = require('express').Router()
const profileController = require('../controllers/profileController')
const upload = require('../config/upload')

router.post('/', upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), profileController.createProfile)
router.patch('/:id', upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), profileController.updateProfile)
router.get('/:userId', profileController.getProfile)




module.exports = router