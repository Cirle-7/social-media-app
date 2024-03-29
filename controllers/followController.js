require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
const followers = db.followers;
const Profile = db.profile
const User = db.users

const follow = async (req,res) => {
    // GET USER TO FOLLOW BY USERNAME
    const { username } = req.params
    const user = await User.findOne({
        where: { username: username }
    })
    if(!user) throw new appError('No user with that username', 404)
    // GET USERID FROM THE USER
    const followeeId = user.id   //'the person being followed
    const userId = req.user.id   //'the person doing the follow'
    
    // PREVENT FOLLOWING OWN SELF
    if(followeeId == userId) throw new appError('Can"t follow yourself', 400)
    // CHECK IF USER ALREADY FOLLOWS FOLLOWEE
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

        //UPDATE FOLLOWERS  INCREMENTING USERS 
        await Profile.increment({followers:1}, {where:{userId: userId}})

        return res.status(200).json({ 
            status: 'success',
            message: 'User followed'
        })
    }

}  

const unfollow = async (req,res) => {
    // GET USER TO FOLLOW BY USERNAME
    const { username } = req.params
    const user = await User.findOne({
        where: { username: username }
    })
    if(!user) throw new appError('No user with that username', 404)
    // GET USERID FROM THE USER
    const followeeId = user.id   //'the person being followed
    const userId = req.user.id   //'the person doing the follow'
    console.log(followeeId,userId)
    
    // CHECK IF USER FOLLOWS FOLLOWEE
    const existingFollow = await followers.findOne({
        where: {
            followeeId: followeeId,
            userId: userId,
        }
    })

    if(!existingFollow) throw new appError('already unfollowed',404)


    // IF ALREADY FOLLOWS
        const unfollow = await existingFollow.destroy()

    //UPDATE FOLLOWERS  INCREMENTING USERS 

    await Profile.decrement({followers:1}, {where:{userId: userId}})

    
    return res.status(200).json({ 
        status: 'success',
        message: 'Unfollowed user' 
    })
    
}

const getFollowers = async(req,res)=>{
    const user = req.user

    //GET LIST OF FOLLOWERS ID
    const myFollowers = await followers.findAll({
        where:{
            followeeId : user.id
        },
        attributes:{ exclude: ["followeeId", "id", "createdAt","updatedAt"]},
        include:{
            model: User,
            required: true,
            attributes: { exclude: ["password"] },
            include:Profile   
        }
    })

    res.status(200).json({ status: true, myFollowers, nHit: myFollowers.length })
}

const getFollowings = async(req,res)=>{
    const user = req.user

    //GET LIST OF FOLLOWS ID
    const myFollows = await followers.findAll({
        where:{
            userId : user.id
        },
        attributes:{ exclude: ["userId", "id", "createdAt","updatedAt"]},
        include:{
            model: User,
            as: 'followee',
            required: true,
            attributes: { exclude: ["password"] },
            include:Profile   
        }
    })

    res.status(200).json({ status: true, myFollows, nHit: myFollows.length })
}

const getUserFollowers = async(req,res)=>{
    const username =  req.params.user

        //GET USER
    const user = await User.findOne({
        where: { username: username }
    })

    //GET LIST OF FOLLOWS ID
    const fOllowers = await followers.findAll({
        where:{
            followeeId : user.id
        },
        attributes:{ exclude: ["followeeId", "id", "createdAt","updatedAt"]},
        include:{
            model: User,
            required: true,
            attributes: { exclude: ["password"] },
            include:Profile   
        }
    })

    res.status(200).json({ status: true, fOllowers, nHit: fOllowers.length })

}

const getUserFollows = async(req,res)=>{
const username =  req.params.user

//GET USER
const user = await User.findOne({
    where: { username: username }
})

//GET LIST OF FOLLOWS ID
const follows = await followers.findAll({
    where:{
        userId : user.id
    },
    attributes:{ exclude: ["userId", "id", "createdAt","updatedAt"]},
    include:{
        model: User,
        as: 'followee',
        required: true,
        attributes: { exclude: ["password"] },
        include:Profile   
    }
})

res.status(200).json({ status: true, follows, nHit: follows.length })

}





module.exports = {
    follow,
    unfollow,
    getFollowers,
    getFollowings,
    getUserFollowers,
    getUserFollows
}