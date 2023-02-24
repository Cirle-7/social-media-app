const express = require('express')
const Router = express.Router()
const multer = require('multer')


//IMPORT POST LOGIC CONTROLLER
const {commentOnAPost,deleteComment,disLikeAComment,getAllCommentsOfAPost,getCommentById,likeAComment} = require('../controllers/commentController')

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

Router.route('/new/:postId').post(postValidationMiddleware,  upload.array("media_url", 4), commentOnAPost).get(getAllCommentsOfAPost)
Router.route('/:commentId').delete(deleteComment).get(getCommentById)
Router.route('/like/:id').post(likeAComment).delete(disLikeAComment)



module.exports = Router