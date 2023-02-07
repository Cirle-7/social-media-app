const multer = require("multer");
const path = require("path");

const uploads_destination = "uploads/";
// // const images_destination = "images/"

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    return callback(null, uploads_destination);
  },
  filename: (req, file, callback) => {
    return callback(
      null,
      `image_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10, // Max filesize = 10MB
};

const fileFilter = (req, file, callback) => {
  const acceptedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  if (acceptedImageTypes.includes(file.mimetype)) return callback(null, true);

  return callback(new Error("Only image files are allowed!"), false);
};

module.exports = multer({ storage, limits, fileFilter });
