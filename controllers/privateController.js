require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
const User = db.users

exports.makePrivate = async (req,res) => {
    // GET USER TO MAKE PRIVATE'S ID
    const userId = req.user.id 
    
    // SEARCH USER
    const user = await User.findOne({
        where: { id: userId }
    });

    // UPDATE isPrivate to true
    const private = await user.update({
        isPrivate: true
    });

    return res.status(200).json({
        message: 'Account Private Successful'
    })
}

exports.makePublic = async (req,res) => {
    // GET USER TO MAKE PRIVATE'S ID
    const userId = req.user.id 
    
    // SEARCH USER
    const user = await User.findOne({
        where: { id: userId }
    });

    // UPDATE isPrivate to true
    const private = await user.update({
        isPrivate: false
    });

    return res.status(200).json({
        message: 'Account Public Successful'
    })
}