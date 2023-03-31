require('express-async-errors')
const crypto = require('crypto')
const Tokens = require("../utils/tokens");
const db = require('../models')
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { Op } = require('sequelize');
const Profile = db.profile
const User = db.users
require('dotenv').config()

// REQUEST DELETE USER PROFILE
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

    // DEFINE RESPONSE MESSAGE
    let message = 'A link has been sent to your mail. Please check your mail to continue.'
    message = process.env.NODE_ENV === 'production' ? message : `${message}${deactivationUrl}`

    // try {
    await new Email(user, deactivationUrl).sendDeactivation()
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: message
            })
        }).catch((err) => {
            // throw new AppError(err, 500)
            res.status(500).json({
                error: err
            })
        })


    // } catch (err) {
    //     throw new AppError('Error sending deactivation link. Please try again', 500)
    // }
}


// DEACTIVATE A USER'S PROFILE ON PROFILE DELETE REQUEST
exports.deactivate = async (req, res) => {

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
    const user = await User.findOne({
        where: { id: profile.userId }
    })

    user.deletionDate = Date.now() + (30 * 24 * 60 * 60 * 1000);
    await user.save()

    const activationUrl = `${req.protocol}://${req.get('host')}/api/v1/account/activate`

    //SEND CONFIRMATION MAIL
    try {
        await new Email(user, activationUrl).sendDeactivationConfirmation()

        res.status(200).json({
            status: 'success',
            message: `Your account has been deactivated, and will be permanently deleted after 30days of inactivity. Thanks`

        })
    } catch (err) {
        throw new AppError(
            `Your account has been successfully deactivated, but there was an error sending you a confirmation.\ 
                Your account will be permanetly deleted in 30 days`,
            500)
    }
}


exports.activate = async (req, res) => {

    const { email, password } = req.body

    if (!email && !password) throw new AppError('All fields are required!', 400)

    const user = await User.findOne({
        where: { email: email }
    })

    //NOTIFY USERS WITH SOCIAL AUTH WHEN LOGGING IN
    if (user && !user.password)
        throw new AppError(
            "Please activate your account through socials", 400
        );

    // CHECK IF USER EXISTS WITHOUT LEAKING EXTRA INFOS
    if (!user || !(await user.comparePassword(password)))
        throw new AppError("Email Or Password Incorrect", 400);

    // CHECK IF USER ACCOUNT IS NOT DEACTIVATED
    if (!user.deletionDate) throw new AppError("Your account is not deactivated!", 400)

    // ACTIVATE PROFILE
    const profile = await Profile.update(
        { isdeactivated: false },
        { where: { userId: user.id } }
    )

    // SET USER DELETION DATE TO NULL
    user.deletionDate = null
    await user.save()

    try {

        const profileUrl = `${req.protocol}://${req.get('host')}/api/v1/profiles/${user.username}`
        await new Email(user, profileUrl).sendConfirmReactivation()

        res.status(200).json({
            status: 'success',
            message: 'Your account has been succesfully reactivated!'
        })
    } catch (err) {
        throw new AppError(
            `Your account has been reactivated, but there was an error sending you a confirmation.`,
            500)
    }
}