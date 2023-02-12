const router = require('express').Router()
const profileController = require('../controllers/profileController')
const upload = require('../config/upload')
const authentication = require('../middleware/authentication')
router.post('/', 
    authentication, 
    getLocation, 
    upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), 
    profileController.createProfile
)
router.patch('/:id', authentication, getLocation, upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), profileController.updateProfile)
router.get('/:username', profileController.getProfile)




module.exports = router