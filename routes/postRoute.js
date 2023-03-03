const express = require('express')
const Router = express.Router()
const multer = require('multer')
const { getLocation } = require("../middleware/getLocationMW");


//IMPORT POST LOGIC CONTROLLER
const { draftAPost, editPost, deletePost, getAllPost ,getPostById, publishAPost, likeAPost ,disLikeAPost, getMyDraftPosts} = require('../controllers/postController')

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


Router.route('/').post(postValidationMiddleware, upload.array("media_url"),publishAPost).get(getAllPost)
Router.route('/draft').post(postValidationMiddleware, upload.array("media_url"),draftAPost)
Router.route('/myDrafts').get(getMyDraftPosts)
Router.route('/:id').patch( updatePostValidatorMiddleware, upload.array("media_url", 4), editPost).delete(deletePost).get(getPostById)
Router.route('/like/:id').post(likeAPost).delete(disLikeAPost)



module.exports = Router