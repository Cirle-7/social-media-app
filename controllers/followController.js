require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
const followers = db.followers;

const follow = async (req,res) => {
    
    const followeeId = req.params.id  //'the person being followed'
    const userId = req.user.id   //'the person doing the follow'
    // const followBack = 'true or false depending on if owner and follower follow each other'
    // logger.info(req.user)
    
    // // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            followeeId: followeeId,
            userId: userId,
        }
    })

    // IF ALREADY FOLLOWS
    if(existingFollow){
        return res.status(400).json({ message: 'You already follow this user'})
    }
    
    // IF NOT, CREATE FOLLOW
    if(!existingFollow){
        const follow = await followers.create({
            followeeId: followeeId,
            userId: userId,
        })

        return res.status(200).json({ 
            status: 'success',
            message: 'User followed'
        })
    }

}  

const unfollow = async (req,res) => {
    // logger.info(req.user)
    const followeeId = req.params.id  //'the person being followed'
    const userId = req.user.id   //'the person doing the follow'
    
    // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            followeeId: followeeId,
            userId: userId,
        }
    })
    // IF ALREADY FOLLOWS
    if(existingFollow){
        const unfollow = await existingFollow.destroy()
    }
    
    return res.status(200).json({ 
        status: 'success',
        message: 'Unfollowed user' 
    })
    
}


module.exports = {
    follow,
    unfollow
}