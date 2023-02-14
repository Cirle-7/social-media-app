require('express-async-errors')
const Tokens = require("../utils/tokens");
const db = require('../models')
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Profile = db.profile
const User = db.users
require('dotenv').config()

// DEACTIVATE USER'S PROFILE
exports.deleteProfile = async (req, res, next) => {

    const email = req.user.email
    if (!email) throw new AppError('Please log in to complete this action', 401)

    const user = await User.findOne({
        where: { email: email }
    })
    console.log('User', user);
    if (!user) throw new AppError('User does not exist!', 401)

    const { token,
        deactivationToken,
        deactivationTokenExpires
    } = await Tokens.createDeactivationToken();

    // const updatedUser = await User.update(
    //     {
    //         deactivationToken: deactivationToken,
    //         deactivationTokenExpires: deactivationTokenExpires,
    //     },
    //     { where: { email: email } }
    // );

    const deactivationUrl = `${req.protocol}://${req.get(
        "host")}/api/vi/profiles/deactivate/${token}`

    try {
        await new Email(user, deactivationUrl).sendDeactivation()

        res.status(200).json({
            status: 'success',
            message: `A link has been sent to your mail. Please check your mail to continue.`

        })
    } catch (err) {
        throw new AppError('Error sending deactivation link. Please try again', 500)
    }
}



// DEACTIVATE A USER'S PROFILE ON PROFILE DELETE REQUEST
exports.deactivateProfile = async (req, res) => {

    const { user } = req
    const email = user.email

    // console.log('User ', user);
    const profile = await Profile.update(
        { deactivated: true },
        {
            where: { userId: user.id }
        })

    if (!profile) throw new AppError('Please log in to complete this action', 401)

    res.status(200).json({
        status: true,
        message: `Your account will be deactivated 
        for 30days after which it will be permanently deleted`
    })

}