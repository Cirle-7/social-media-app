require("express-async-errors");
const db = require("../models");
const AppError = require("../utils/appError");
const Post = db.post;

//IMPORT CLOUDINARY
const uploadToCloudinary = require('../utils/cloudinaryFunctions')




// CREATE POST CONTROLLER
const createPost = async (req, res) => {
  // DEStRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files } = req;

  const urls = [];

  for (let file of files) {
    const { path } = file;
    const url = await uploadToCloudinary(path);
    urls.push(url);
  }

  body.userId = user.id;
  body.media_url = urls.join("||") ?? "";

  const post = await Post.create(body);

  res.status(200).json({ status: true, post });
};


module.exports = { createPost };
