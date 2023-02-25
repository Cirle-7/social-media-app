require("express-async-errors");
const db = require("../models");
const AppError = require("../utils/appError");
const Post = db.post;
const User = db.users;
const Like = db.likes;
const Profile = db.profile;
const Comment = db.comments
const { Op } = require("sequelize");
const contentModifer = require("./../utils/contentModifier");

//IMPORT CLOUDINARY
const uploadToCloudinary = require("../utils/cloudinaryFunctions");
// DRAFT A POST CONTROLLER
const draftAPost = async (req, res) => {
  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files, location } = req;
  const urls = [];

  if (files) {
    for (let file of files) {
      const { path } = file;
      const url = await uploadToCloudinary(path);
      urls.push(url);
    }
  }
  const { body: info } = body;

  let tags;
  if (info) {
    let bodyInfo = info.trim();
    bodyInfo = bodyInfo.split(" " ?? "  ");

    tags = bodyInfo.filter((bod) => bod.startsWith("#"));
  }

  //Dectect Topic From Body
  let topicArray = [];
  contentModifer.dectectTopic(info, topicArray);

  //Filter POST CONTENT
  body.body = contentModifer.filterContent(info);
  body.location = location;
  body.topic =
    topicArray.length > 2
      ? topicArray[Math.floor(Math.random() * topicArray.length)]
      : topicArray[0];
  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";

  const post = await Post.create(body);
  res.status(200).json({ status: true, post });
};


// PUBLISH A POST CONTROLLER
const publishAPost = async (req, res) => {
  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files } = req;
  const urls = [];

  if (files) {
    for (let file of files) {
      const { path } = file;
      const url = await uploadToCloudinary(path);
      urls.push(url);
    }
  }
  const { body: info } = body;

  let tags;
  if (info) {
    let bodyInfo = info.trim();
    bodyInfo = bodyInfo.split(" " ?? "  ");

    tags = bodyInfo.filter((bod) => bod.startsWith("#"));
  }

  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";
  body.status = "Published"

  const post = await Post.create(body);
  res.status(200).json({ status: true, post });
};


// GET ALL  POST CONTROLLER
const getAllPost = async (req, res) => {
  // DESTRUCTURE QUERY REQUEST
  const { limit, userId, tags, search, status, orderBy } = req.query;

  //
  const queryObject = {};

  queryObject.limit =  limit ? Number(limit): 10;


  const findObject = {};

  findObject.status = status ? status : "Published";
  if (userId) {
    findObject.userId = userId;
  }
  if (tags) {
    findObject.tags = { [Op.like]: `%${tags}%` };
  }

  if (search) {
    findObject.body = { [Op.like]: `%${search}%` };
  }
  const order = orderBy ? orderBy : "updatedAt";

  const posts = await Post.findAll({
    where: { ...findObject },
    ...queryObject,
    order: [[order, "DESC"]],
    include: [
      {
        model: User,
        required: true,
        attributes: { exclude: ["password"] },
        include: Profile,
      },
      {
        model: Like,
      },
      {
        model: Comment,
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });

  const allPosts = posts.map((post) => {
    const { likes, comments } = post;

    post.likesNo = likes.length;
    post.commentsNo = comments.length
    return {
      post,
    };
  });

  res.status(200).json({ status: true, allPosts, nHit: allPosts.length });
};

// GET POST BY ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: { id },
    include: [
      {
        model: User,
        required: true,
        attributes: { exclude: ["password"] },
        include: Profile,
      },
      {
        model: Like,
      },
      {
        model: Comment,
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });
  if (!post) throw new AppError("post not found", 404);

  const { likes } = post;
  post.views += 1;
  post.likesNo = likes.length;
  post.commentsNo = comments.length
  await post.save();

  res.status(200).json({
    status: true,
    post,
  });
};

// EDIT POST CONTROLLER
const editPost = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        required: true,
        attributes: { exclude: ["password"] },
        include: Profile,
      },
      {
        model: Like,
      },
      {
        model: Comment,
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });

  // POST NOT FOUND
  if (!post) {
    throw new AppError("post not found", 404);
  }

  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files } = req;

  const urls = [];

  if (files) {
    for (let file of files) {
      const { path } = file;
      const url = await uploadToCloudinary(path);
      urls.push(url);
    }
  }

  const { body: info } = body;
  const {likes,comments} = post

  let tags;
  if (info) {
    let bodyInfo = info.trim();
    bodyInfo = bodyInfo.split(" " ?? "  ");

    tags = bodyInfo.filter((bod) => bod.startsWith("#"));
  }
  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";
  body.likesNo = likes.length
  body.commentsNo = comments.length

  const updatedPost = await post.update(body);

  res.status(200).json({ status: true, updatedPost });
};

//DELETE POST
const deletePost = async (req, res) => {
  const post = await Post.destroy({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  // POST NOT FOUND
  if (!post) {
    throw new AppError("post not found", 404);
  }

  return res.status(200).json({ message: "Post deleted  successful" });
};


// LIKE A POST
const likeAPost = async (req, res) => {
        // CHECK IF POST ID EXISTS
      const post = await Post.findOne({
        where: { id:req.params.id },
      });
      if(!post) throw new AppError("post doesn't exist", 400)
   
  // CHECK IF ITS BEEN LIKED BEFORE
  const check = await Like.findOne({
    where: {
      userId: req.user.id,
      postId: req.params.id,
    },
  });

  if (check) throw new AppError("already liked", 400);

  await Like.create({
    userId: req.user.id,
    postId: req.params.id,
  });

  return res.status(200).json({ message: "Post Liked" });
};


// DISLIKE A POST
const disLikeAPost = async (req, res) => {
        // CHECK IF POST ID EXISTS
      const post = await Post.findOne({
        where: { id:req.params.id },
      });
      if(!post) throw new AppError("post doesn't exist", 400)
   
  // CHECK IF ITS BEEN LIKED BEFORE
  const check = await Like.findOne({
    where: {
      userId: req.user.id,
      postId: req.params.id,
    },
  });

  if (!check) throw new AppError("already disliked", 400);

  await Like.destroy({
    where: {
      userId: req.user.id,
      postId: req.params.id,
    },
  });

  return res.status(200).json({ message: "Post disLiked" });
};


//GET MY DRAFT POSTs
const getMyDraftPosts = async (req, res) => {

  const posts = await Post.findAll({
    where: { 
      userId:req.user.id,
      status:"Draft"
     },
  });

  res.status(200).json({ status: true, posts, nHit: posts.length });
};

module.exports = {
  draftAPost,
  editPost,
  deletePost,
  getAllPost,
  getPostById,
  publishAPost,
  likeAPost,
  disLikeAPost,
  getMyDraftPosts
};
