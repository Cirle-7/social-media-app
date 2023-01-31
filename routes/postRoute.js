const express = require('express')
const Router = express.Router()
const multer = require('multer'
)
//import post logic controllers
const { createPost } = require('../controllers/postController')

// set destination for your files
const upload = multer({dest:"uploads/", fileFilter :  (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }})


Router.route('/').post(  upload.single("media_url"), createPost)


module.exports = Router