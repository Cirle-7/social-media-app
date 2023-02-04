require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const db = require('../models')
const Profile = db.profile
require('dotenv').config()


const createProfile = async (req,res) => {
    // get req body and files
    const { Bio, website, location, github_link, twitter_link } = req.body
    // handle images upload
    const imagesUpload = req.files
    let avatarPath;
    let headerPath;
    const defaultHeaderURL = 'https://cdn.pixabay.com/photo/2016/08/30/16/26/banner-1631296__340.jpg'
    const defaultAvatarURL = 'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg'
    let avatar, header, headerURL,avatarURL
    if (imagesUpload && imagesUpload.avatar) {
        avatarPath = imagesUpload.avatar[0].path;
        avatar = await cloudinary.uploader.upload(avatarPath)
        avatarURL = avatar.url || defaultAvatarURL
    }
    if (imagesUpload && imagesUpload.header) {
        headerPath = imagesUpload.header[0].path;
        header = await cloudinary.uploader.upload(headerPath)
        headerURL = header.url || defaultHeaderURL
    }
    
    // create profile in db
    const profile = await Profile.create({
        Bio, website, location, github_link, twitter_link,
        avatarURL: avatarURL,
        headerURL: headerURL,
        // userId: req.user.id 
    })
    
    return res.status(201).json({
        message: 'profile create successful',
        status: true,
        data: {
            profile
        }
    })
}


const updateProfile = async (req,res) => {
        
    // GET BODY 
    const { Bio, website, location, github_link, twitter_link } = req.body
    const imagesUpload = req.files

    const profile = await Profile.findOne({
        where: {
          id: req.params.id
        }
    });
    
    // PROFILE NOT FOUND
    if(!profile){
        throw new appError('User profile not found',404)
    }

    // FILE UPLOAD
    let avatarPath, headerPath
    
    let avatar, header, avatarURL, headerURL
    if (imagesUpload && imagesUpload.avatar) {
        avatarPath = imagesUpload.avatar[0].path;
        avatar = await cloudinary.uploader.upload(avatarPath)
        avatarURL = avatar.url
    }
    if (imagesUpload && imagesUpload.header) {
        headerPath = imagesUpload.header[0].path;
        header = await cloudinary.uploader.upload(headerPath)
        headerURL = header.url
    }

    // WHEN FOUND, UPDATE THE APPROPRIATE FIELDS
    const update = await profile.update({
        Bio, website,location, github_link, twitter_link, 
        headerURL:  headerURL,
        avatarURL:  avatarURL
    })
    
    return res.status(201).json({
        message: 'profile updated',
        status: true,
        data: {
            update
        }
    })
}


const getProfile = async (req,res) => {
    // GET USER ID FROM REQ USER
    const userId = req.params.userId
    console.log(userId)
    const profile = await Profile.findOne({
        where: {
          userId: userId
        }
    });

    if(!profile){
        throw new appError('Profile not found', 404)
    }

    res.status(200).json({
        message: 'success',
        data: {
            profile
        }
    })
}



module.exports = {
    updateProfile,
    createProfile,
    getProfile
}