require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models')
const followers = db.followers;
const followings = db.following;

const follow = async (req,res) => {
    const followerId = req.body.userId  //will use req.user.id
    const followeeId = req.params.id
    // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            follower_id: followerId,
            following_id: followeeId
        }
    })
    // IF ALREADY FOLLOWS
    if(existingFollow){
        return res.status(400).json({ message: 'You already follow this user'})
    }
    
    // IF NOT, CREATE FOLLOW
    if(!existingFollow){
        const follow = await followings.create({
            follower_id: followerId,
            following_id: followeeId
        })
        // UPDATE CORRESPONDING FOLLOWINGS TABLE
        // const followee = await followers.create({
        //     follower_id: followeeId,
        //     following_id: followerId
        // })
        return res.status(200).json({ message: 'Follow successful' })
    }
}  

const unfollow = async (req,res) => {
    const followerId = req.body.userId   //req.user.id
    const followeeId = req.params.id
    // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            follower_id: followerId,
            following_id: followeeId
        }
    })
    // IF ALREADY FOLLOWS
    if(existingFollow){
        const unfollow = await existingFollow.destroy()
    }
    
    return res.status(200).json({ message: 'Unfollow successful' })
    
}


module.exports = {
    follow,
    unfollow
}