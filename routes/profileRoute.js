const router = require('express').Router()
const profileController = require('../controllers/profileController')
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})

router.post('/', upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), profileController.createProfile)
router.patch('/:id', upload.fields([{name:'avatar', maxCount: 1},{name:'header', maxCount: 1}]), profileController.updateProfile)
router.get('/:userId', profileController.getProfile)




module.exports = router