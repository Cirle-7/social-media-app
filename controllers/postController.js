require("express-async-errors");
const db = require("../models");
const AppError = require("../utils/appError");
const Post = db.post;
const User = db.users;
const Like = db.likes;
const { Op } = require("sequelize");
const contentModifer = require("./../utils/contentModifier");

//IMPORT CLOUDINARY
const uploadToCloudinary = require("../utils/cloudinaryFunctions");

// CREATE POST CONTROLLER
const createPost = async (req, res) => {
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

// GET ALL  POST CONTROLLER
const getAllPost = async (req, res) => {
  // DESTRUCTURE QUERY REQUEST
  const { limit, userId, tags, search, status, orderBy } = req.query;

  //
  const queryObject = {};
  if (limit) {
    queryObject.limit = Number(limit) || 1;
  }

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
    // include:User,
    // include: [ { all: true, attributes: { exclude: ["password"] } }, ],
    // include:{model:Like},
    include: [
      {
        model: User,
        required: true,
        attributes: { exclude: ["password"] },
      },
      {
        model: Like,
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });

  const allPosts = posts.map((post) => {
    const {
      user: { username },
      likes,
    } = post;

    post.likesNo = likes.length;
    return {
      post,
      profileUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/v1/profiles/${username}`,
    };
  });

  res.status(200).json({ status: true, allPosts, nHit: allPosts.length });
};

// GET POST BY ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: { id },
    include: User,
    include: [{ all: true, attributes: { exclude: ["password"] } }],
  });
  post.views += 1;
  await post.save();

  if (!post) throw new AppError("post not found", 404);

  const {
    user: { username },
  } = post;

  res.status(200).json({
    status: true,
    post,
    profileUrl: `${req.protocol}://${req.get(
      "host"
    )}/api/v1/profiles/${username}`,
  });
};

// EDIT POST CONTROLLER
const editPost = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
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

  let tags;
  if (info) {
    let bodyInfo = info.trim();
    bodyInfo = bodyInfo.split(" " ?? "  ");

    tags = bodyInfo.filter((bod) => bod.startsWith("#"));
  }
  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";

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

//DRAFT A POST
const draftPost = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });
  if (!post) throw new AppError("post not found", 404);
  //UPDATE POST STATUS TO DRAFT
  post.status = "Draft";
  await post.save();
  return res.status(200).json({ message: "Post Drafted" });
};

const likeAPost = async (req, res) => {
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

const disLikeAPost = async (req, res) => {
  // CHECK IF ITS BEEN LIKED BEFORE
  const check = await Like.findOne({
    where: {
      userId: req.user.id,
      postId: req.params.id,
    },
  });

  if (!check) throw new AppError("already disliked", 400);

  await Like.destroy({
    userId: req.user.id,
    postId: req.params.id,
  });

  return res.status(200).json({ message: "Post disLiked" });
};
//GET ALL DRAFTS

module.exports = {
  createPost,
  editPost,
  deletePost,
  getAllPost,
  getPostById,
  draftPost,
  likeAPost,
  disLikeAPost,
};
