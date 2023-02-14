require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models')
const AppError = require('../utils/appError')
const Profile = db.profile
const User = db.users
require('dotenv').config()


exports.deleteProfile = async(req, res) => {
    // DELETE USER'S PROFILE

    const { user } = req

    console.log('User ', user);

    if(!user) throw new AppError('Please log in to complete this action', 401)

    const deletedUser = await User.destroy({
        where: { id: user.id }
    })
    res.status(200).json({
        message: 'success',
        data: deletedUser
    })
}

// DEACTIVATE A USER'S PROFILE ON PROFILE DELETE REQUEST
exports.deactivateProfile = async(req, res) => {
    
    const { user } = req

    // console.log('User ', user);
    const profile = await Profile.update(
        { deactivated: true },
        {where: { userId: user.id }
    })

    if(!profile) throw new AppError('Please log in to complete this action', 401)

    res.status(200).json({
        status: true,
        message: "Your account will be deactivated \
        for 30days after which it will be permanently deleted"
    })

}