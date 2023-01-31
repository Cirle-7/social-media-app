require('express-async-errors')
const db = require('../models')
const Post = db.post
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const fs = require('fs')


// this is to configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key:  process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET 
  });

const createPost = async (req,res) =>{
    const body = req.body

    // const files= req.files
    // const cloudinaryPaths = files.map(async (file)=>{
    //     await cloudinary.uploader.upload(file.path,{folder:"media_url"}).secure_url
    // })

    const filePath = req.file?.path


    const cloudinaryPath = filePath ? await cloudinary.uploader.upload(filePath,{folder:"media_url"}): ''
    body.media_url = cloudinaryPath.secure_url || ''

    fs.unlink(filePath,(err)=>{
        if(err)console.log(err);

    })

    const post = await Post.create(body)

    res.status(200).json({status:true, post})

}

let likePost;



module.exports = { createPost}