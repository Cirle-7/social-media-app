const express = require('express')
const Router = express.Router()
const multer = require('multer')

// set destination for your files
const upload = multer({dest:"uploads/"})

//import post logic controllers
const { createPost } = require('../controllers/postController')

Router.route('/').post( upload.single("media_url"), createPost)


module.exports = Router