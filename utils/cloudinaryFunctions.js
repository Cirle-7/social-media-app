const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { unlink } = require("fs").promises;
require('express-async-errors')
const AppError =  require("../utils/appError");



//CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  
  
  
  
  // FUNCTION TO UPLOAD FILE TO CLOUDINARY
  async function uploadToCloudinary(filePath) {
    return cloudinary.uploader
      .upload(filePath, { folder: "pictures" })
      .then(async (result) => {
  
        // REMOVE FILE FROM LOCAL UPLOADS FOLDER
        await unlink(filePath);
  
        return result.secure_url;
      })
      .catch(async (error) => {
  
        // REMOVE FILE FROM LOCAL UPLOADS FOLDER
        await unlink(filePath);
         throw new AppError("server error from cloudinary");
      });
  }

  module.exports = uploadToCloudinary