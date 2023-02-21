const express = require('express')
const Router = express.Router()
const multer = require('multer')


//IMPORT POST LOGIC CONTROLLER
const { createPost, editPost, deletePost, getAllPost ,getPostById, draftPost, likeAPost ,disLikeAPost} = require('../controllers/postController')

//IMPORT VALIDATION MIDDLEWARE
const {postValidationMiddleware, updatePostValidatorMiddleware} = require('../validation/postValidation')

//SET 
const upload = multer({dest:"uploads/", fileFilter :  (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }})

Router.route('/').post(postValidationMiddleware,  upload.array("media_url", 4), createPost).get(getAllPost)
Router.route('/:id').patch( updatePostValidatorMiddleware, upload.array("media_url", 4), editPost).delete(deletePost).get(getPostById)
Router.route('/draft/:id').put(draftPost)
Router.route('/like/:id').post(likeAPost).delete(disLikeAPost)



module.exports = Router