const express = require("express");
const Router = express.Router();
const multer = require("multer");
const authenticate = require("./../middleware/authentication");

//IMPORT POST LOGIC CONTROLLER
const postController = require("../controllers/postController");

//SET
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

Router.route("/").post(
  upload.array("media_url", 4),
  authenticate,
  postController.createPost
);

module.exports = Router;
