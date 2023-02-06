const express = require('express')
const Router = express.Router()
const multer = require('multer')


//IMPORT POST LOGIC CONTROLLER
const { createPost } = require('../controllers/postController')

//SET 
const upload = multer({dest:"uploads/", fileFilter :  (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }})

Router.route('/').post(  upload.array("media_url", 4), createPost)


module.exports = Router