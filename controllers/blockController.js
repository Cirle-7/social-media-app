require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
const blockedAccount = db.blockedAccounts;
const User = db.users

exports.blockUser = async (req,res) => {
    const blockerId = req.user.id 
    const userToBlock = req.params.id;
    // CAN'T BLOCK OWN ACCOUNT
    if(blockerId == userToBlock){
        throw new appError('Forbidden', 403)
    }
    
    // CHECK IF ALREADY BLOCKED
    const isBlocked = await blockedAccount.findOne({
        where: {
            blockedBy: blockerId,
            blockedUser: userToBlock
        }
    })
    // res.json(isBlocked)
    // IF NOT ALREADY BLOCKED
    if(!isBlocked) {
        // CREATE BLOCK
        const block = await blockedAccount.create({
            blockedBy: blockerId,
            blockedUser: userToBlock
        })

        res.status(200).json({
            status: 'success',
            message: `User blocked`
        })
    }
    
    // WHEN USER IS ALREADY BLOCKED
    res.status(400).json({ message: 'User already blocked '})
}

exports.unblockUser = async (req,res) => {
    const blockerId = req.user.id 
    const user = req.params.id;
    // GET USER TO UNBLOCK
    const userToUnblock = await blockedAccount.findOne({
        where: {
            blockedUser: user
        }
    })
    if(!userToUnblock) res.status(404).json('NO user found')
    // BLOCK USER
    if(userToUnblock){
        const unblock = await blockedAccount.destroy({
            where: {
                blockedUser: user
            }
        })
    }

    res.status(200).json({
        status: 'success',
        message: 'User unblocked'
    })
}

exports.getUser = async (req,res) => {
    // Find the user to be displayed
    const user = await User.findOne({ where: { id: req.params.userId } });

    // Check if the user has been blocked
    const isBlocked = await blockedAccount.findOne({ 
      where: {
        blockedUser: req.params.userId,
        blockedBy: req.user.id 
      } 
    });

    // If the user has been blocked, return a status code of 401 (Unauthorized)
    if (isBlocked) return res.status(401).send('Unauthorized');

    // Continue with rendering the user's information
    res.status(200).json({
        user
    });
}