/**
 * This middleware checks and permits blocked and unblocked users access 
 * 
 */
require('express-async-errors')
const logger = require('../utils/logger')
const appError = require('../utils/appError')
const db = require('../models')
const blockedAccounts = db.blockedAccounts;
const User = db.users;
const Followers = db.followers


const accessControl = async (req,res,next) => {
    // find user to be interacted with
    // GET USERNAME FROM REQ PARAMS
    const { username } = req.params
    // FETCH USER FROM DB
    const user = await User.findOne({
        where: { username: username }
    })
    if(!user){
        res.status(404).json({
            status: 'fail',
            message: `No user with username ${username} `
        })
    }
    // CHECK IF USER IS BLOCKED
    const isBlocked = await blockedAccounts.findOne({
        where: {
            userId: user.id, // check 
            blockedUser: req.user.id //check if the person making the request has been blocked by user
        }
    })

    if(isBlocked){ 
        res.status(403).json({
            status: 'fail',
            message: 'Blocked'
        })
    } else {
         console.log('not blocked')
         next()
    }
}

/**
 * This middleware checks if the user is authorized to view the private account by checking if the user is the owner of the account, is following the account or the account is public.
*/
const authorizeAccessToPrivateAccount = async (req, res, next) => {
    const loggedInUserId = req.user.id //current user
    const { username } = req.params  //account to access
        
    // // FIND USER 
    const findUser = await User.findOne({ where: { username: username }})
    const userId = findUser.id  //get id of found user

    // ALLOW ACCESS TO OWN PRIVATE ACC
    if(userId === loggedInUserId){
        return next()
    }

    // CHECK IF USER IS FOLLOWER OF PRIVATE ACCOUNT 
    const isFollower = await Followers.findOne({
        where: {
            followeeId: userId,
            userId: loggedInUserId
        }
    })

    // IF IS FOLLOWER ALLOW ACCESS TO PRIVATE ACCOUNT
    if(isFollower){
        return next()
    }

    // CHECK IF USER TO ACCESS IS PUBLIC ACCOUNT
    const user = await User.findOne({
        where: {
            id: userId, //findUser.id
            isPrivate: false
        },
    });

    if(user){
        return next()
    }

    return res.status(403).json({
        message: 'Unauthorized access'
    })
}

// FOR USERS WHO ARE NOT LOGGED IN
const authorizeAccessToPrivateAccountForLoggedOutUsers = async (req, res, next) => {
    const { username } = req.params  //account to access
        
    // // FIND USER 
    const findUser = await User.findOne({ where: { username: username }})
    const isPrivate = findUser.isPrivate === true //check if account is private
    if(isPrivate){
        return res.status(403).json({ message: `This is a private account. Follow user to get accesss`})
    }
    next()
}


module.exports = {
    accessControl,
    authorizeAccessToPrivateAccount,
    authorizeAccessToPrivateAccountForLoggedOutUsers
}