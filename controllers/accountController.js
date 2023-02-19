require('express-async-errors')
const crypto = require('crypto')
const Tokens = require("../utils/tokens");
const db = require('../models')
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { Op, where } = require('sequelize');
const Profile = db.profile
const User = db.users
require('dotenv').config()

// DEACTIVATE USER'S PROFILE
exports.requestDeactivation = async (req, res, next) => {

    const email = req.user.email
    if (!email) throw new AppError('Please log in to complete this action', 401)

    const user = await User.findOne({
        where: { email: email }
    })

    if (!user) throw new AppError('User does not exist!', 401)

    const { token,
        deactivationToken,
        deactivationTokenExpires
    } = await Tokens.createDeactivationToken();

    // UPDATE PROFILE WITH TOKENS
    await Profile.update(
        {
            deactivationToken: deactivationToken,
            deactivationTokenExpires: deactivationTokenExpires,
        },
        { where: { userId: user.id } }
    );

    const deactivationUrl = `${req.protocol}://${req.get("host")}/api/v1/account/deactivate/${token}`

    try {
        await new Email(user, deactivationUrl).sendDeactivation()

        if (process.env.NODE_ENV === 'development') {
            res.status(200).json({
                status: 'success',
                message: `A link has been sent to your mail. Please check your mail to continue.${deactivationUrl}`

            })
        } else {
            res.status(200).json({
                status: 'success',
                message: `A link has been sent to your mail. Please check your mail to continue.`

            })
        }

    } catch (err) {
        throw new AppError('Error sending deactivation link. Please try again', 500)
    }
}



// DEACTIVATE A USER'S PROFILE ON PROFILE DELETE REQUEST
exports.deactivateProfile = async (req, res) => {

    const { token } = req.params

    const confirmToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

    const profile = await Profile.findOne(
        {
            where: {
                deactivationToken: confirmToken,
                deactivationTokenExpires: { [Op.gt]: Date.now() }
            }
        })

    if (!profile) throw new AppError('Please log in to complete this action', 401)

    profile.isdeactivated = true;
    profile.deactivationToken = null;
    profile.deactivationTokenExpires = null;
    await profile.save();

    // SET DELETION DATE TO THE NEXT 30 DAYS
    await User.update(
        { deletionDate: Date.now() + (30 * 24 * 60 * 60 * 1000) },
        {
            where: { id: profile.userId }
        })

    //TODO: SEND CONFIRMATION MAIL

    res.status(200).json({
        status: true,
        message: `Your account will be deactivated for 30days if inactive, after which it will be permanently deleted`
    })

}