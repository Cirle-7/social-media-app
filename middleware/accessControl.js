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


module.exports = {
    accessControl
}