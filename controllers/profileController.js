require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const { Op } = require('sequelize');
const db = require('../models')
const Profile = db.profile;
const User = db.users;
require('dotenv').config()


const createProfile = async (req,res) => {
    
    // get req body and files
    const { Bio, website, location, github_link, twitter_link } = req.body

    if(!location){
        req.body.location = req.location
    }
    
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
        avatarURL = avatar.url
    }
    if (imagesUpload && imagesUpload.header) {
        headerPath = imagesUpload.header[0].path;
        header = await cloudinary.uploader.upload(headerPath)
        headerURL = header.url
    }

    // create profile in db
    const profile = await Profile.create({
        Bio, website, github_link, twitter_link, 
        location,
        avatarURL: avatarURL ?? defaultAvatarURL,
        headerURL: headerURL ?? defaultHeaderURL,
        userId: req.user.id     // get req.user.id from request
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
    // CHECK IF PROFILE BELONGS TO USER
    const userId = req.user.id 
    // GET BODY 
    const { Bio, website, location, github_link, twitter_link } = req.body

    if(!location){
        req.body.location = req.location
    }

    const imagesUpload = req.files

    const profile = await Profile.findOne({
        where: {
          id: req.params.id,
          userId: userId
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
    // GET USERNAME FROM PARAMS
    const { username } = req.params
    // SEARCH FOR USER WITH USERNAME FROM USERS TABLE
    const user = await User.findOne({
        where: {
            username:username
        }
    })
    if(!user) throw new appError('No user with that username', 404)
    // GET USERID FROM FOUND USER
    const userId = user.id
    // SEARCH FOR PROFILE WITH USERID FOUND FROM USER
    const profile = await Profile.findOne({
        where: {
            userId: userId
        }
    })
    
    // IF PROFILE NOT FOUND
    if(!profile) throw new appError('Profile not found', 404)

    //TODO: PUT ON CRON JOB
    // DELETE: ANY ACCOUNT DUE FOR DELETION
    await User.destroy({
        where: {
            deletionDate: { [Op.lt] : Date.now() }
        }
    })

    // SET RESPONSE MESSAGE BASED ON ACCOUNT STATUS
    const message = profile.isdeactivated ? 'This account is deactivated' : 'Profile found'

    // RETURN PROFILE
    res.status(200).json({
        status: 'success',
        message: message,
        data: {
            profile: {
                username: user.username,
                displayName: user.displayName,
                Bio: profile.Bio, 
                website: profile.website,
                location: profile.location,
                github_link: profile.github_link,
                twitter_link: profile.twitter_link,
                avatarURL: profile.avatarURL,
                headerURL: profile.headerURL,
                followers: profile.followers,
                isdeactivated: profile.isdeactivated
            }
        }
    })
}

module.exports = {
    updateProfile,
    createProfile,
    getProfile,
}
