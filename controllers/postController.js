require("express-async-errors");
const db = require("../models");
const AppError = require("../utils/appError");
const Post = db.post;
const User = db.users;
const { Op } = require("sequelize");

//IMPORT CLOUDINARY
const uploadToCloudinary = require("../utils/cloudinaryFunctions");

// CREATE POST CONTROLLER
const createPost = async (req, res) => {
  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files } = req;
  const urls = [];

  for (let file of files) {
    const { path } = file;
    const url = await uploadToCloudinary(path);
    urls.push(url);
  }

  const {body:info} = body

const bodyInfo = info.split(""||" ")
const tags = bodyInfo.filter(bod => bod.startsWith('#'))

  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags.join(' ') ?? "";

  const post = await Post.create(body);
  res.status(200).json({ status: true, post });
};

// GET ALL  POST CONTROLLER
const getAllPost = async (req, res) => {
  // DESTRUCTURE QUERY REQUEST
  const { limit, userId, tags, search } = req.query;

  //
  const queryObject = {};
  if (limit) {
    queryObject.limit = Number(limit) || 1;
  }

  const findObject = {};

  findObject.status = "Published";
  if (userId) {
    findObject.userId = userId;
  }
  if (tags) {
    findObject.tags = { [Op.like]: `%${tags}%` };
  }

  if (search) {
    findObject.body = { [Op.like]: `%${search}%` };
  }

  const posts = await Post.findAll({
    where: { ...findObject },
    ...queryObject,
    order: [["updatedAt", "DESC"]],
    include: User,
    include: [{ all: true, attributes: { exclude: ["password"] } },],
  });

  const newPosts = posts.map((post) => {
    const {
      user: { username },
    } = post;

    return {
      post,
      profileUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/v1/profiles/${username}`,
    };
  });

  res.status(200).json({ status: true, newPosts, nHit: newPosts.length });
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

  res
    .status(200)
    .json({
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

  for (let file of files) {
    const { path } = file;
    const url = await uploadToCloudinary(path);
    urls.push(url);
  }

  body.userId = user.id;
  body.media_url = urls.join("||") ?? "";

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

//GET ALL DRAFTS

module.exports = {
  createPost,
  editPost,
  deletePost,
  getAllPost,
  getPostById,
  draftPost,
};
