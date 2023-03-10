require("express-async-errors");
const db = require("../models");
const AppError = require("../utils/appError");
const Comment = db.comments;
const User = db.users;
const Like = db.likes;
const Profile = db.profile;

//IMPORT CLOUDINARY
const uploadToCloudinary = require("../utils/cloudinaryFunctions");

// CREATE COMMENT ON A POST CONTROLLER
const commentOnAPost = async (req, res) => {
  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files, params:{postId} } = req;
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
    bodyInfo = bodyInfo.split(" ").filter((body)=> body != '');
    tags = bodyInfo.filter((bod) => bod.startsWith("#") && bod.length > 1);
  }

  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";
  body.postId = postId

  const comment = await Comment.create(body);
  res.status(200).json({ status: true, comment });
};

//CREATE A COMMENT ON A COMMENT
const commentOnAComment = async (req, res) => {
  // DESTRUCTURE BODY,USER AND FILES REQUEST
  const { body, user, files, params:{commentId} } = req;
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
    bodyInfo = bodyInfo.split(" ").filter((body)=> body != '');
    tags = bodyInfo.filter((bod) => bod.startsWith("#") && bod.length > 1);
  }

  body.userId = user.id;
  body.media_url = urls ?? "";
  body.tags = tags?.join(" ") ?? "";
  body.commentId = commentId

  const comment = await Comment.create(body);
  res.status(200).json({ status: true, comment });
};

// GET ALL COMMENT OF A POST CONTROLLER
const getAllCommentsOfAPost = async (req, res) => {
  // DESTRUCTURE  REQUEST PARAMS AND QUERY
  const { params:{postId},query:{orderBy} } = req; 

  const order = orderBy ? orderBy : "createdAt";

  const comments = await Comment.findAll({
    where: { postId:postId },
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
          },
          // Qux // Shorthand syntax for { model: Qux } also works here
        ],
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });

  const allComments = comments.map((comment) => {
    const { likes,comments } = comment;

    comment.likesNo = likes.length;
    comment.commentsNo = comments.length
    return {
      comment ,
    };
  });

  res.status(200).json({ status: true, allComments, nHit: allComments.length });
};


// GET ALL COMMENT OF A COMMENT CONTROLLER
const getAllCommentsOfAComment = async (req, res) => {
  // DESTRUCTURE  REQUEST PARAMS AND QUERY
  const { params:{commentId},query:{orderBy} } = req; 

  const order = orderBy ? orderBy : "createdAt";

  const comments = await Comment.findAll({
    where: { commentId:commentId },
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
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });

  const allComments = comments.map((comment) => {
    const { likes,comments } = comment;

    comment.likesNo = likes.length;
    comment.commentsNo = comments.length
    return {
      comment ,
    };
  });

  res.status(200).json({ status: true, allComments, nHit: allComments.length });
};

// GET COMMENT BY ID
const getCommentById = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOne({
    where: { id:commentId },
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
      },
      // Qux // Shorthand syntax for { model: Qux } also works here
    ],
  });
  if (!comment) throw new AppError("Comment  not found", 404);

  const { likes,comments } = comment;
  comment.views += 1;
  comment.likesNo = likes.length;
  comment.commentsNo = comments.length
  await comment.save();

  res.status(200).json({
    status: true,
    comment,
  });
};

//DELETE POST
const deleteComment = async (req, res) => {
  const comment = await Comment.destroy({
    where: {
      id: req.params.commentId,
      userId: req.user.id,
    },
  });

  // POST NOT FOUND
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return res.status(200).json({ message: "Comment deleted  successful" });
};

const likeAComment = async (req, res) => {
  // CHECK IF ITS BEEN LIKED BEFORE
  const check = await Like.findOne({
    where: {
      userId: req.user.id,
      commentId: req.params.id,
    },
  });

  if (check) throw new AppError("already liked", 400);

  await Like.create({
    userId: req.user.id,
    commentId: req.params.id,
  });

  return res.status(200).json({ message: "Comment Liked" });
};

const disLikeAComment = async (req, res) => {
  // CHECK IF ITS BEEN DISLIKED BEFORE
  const check = await Like.findOne({
    where: {
      userId: req.user.id,
      commentId: req.params.id,
    },
  });

  if (!check) throw new AppError("already disliked", 400);

  await Like.destroy({
    where: {
      userId: req.user.id,
      commentId: req.params.id,
    },
  });

  return res.status(200).json({ message: "Comment disLiked" });
};
//GET ALL DRAFTS

module.exports = {
  commentOnAPost,
  commentOnAComment,
  getAllCommentsOfAComment,
  getAllCommentsOfAPost,
  deleteComment,
  likeAComment,
  disLikeAComment,
  getCommentById
};
