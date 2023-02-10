require('express-async-errors')
const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models');
const blockedAccount = db.blockedAccounts;
const User = db.users
const Profile = db.profile

exports.blockUser =  async (req,res) => {
    const { username } = req.params
    // FIND USER BY USERNAME
    const user = await User.findOne({
        where: {
            username: username
        }
    })
    
    if(!user) throw new appError('No user with that username', 404)

    // GET ID FROM USER 
    const blockerId = req.user.id 
    const userToBlock = user.id 

    // CAN'T BLOCK OWN ACCOUNT
    if(blockerId == userToBlock){
        throw new appError('Forbidden', 403)
    }
    
    // CHECK IF ALREADY BLOCKED
    const isBlocked = await blockedAccount.findOne({
        where: {
            userId: blockerId,
            blockedUser: userToBlock
        }
    })
    // res.json(isBlocked)
    // IF NOT ALREADY BLOCKED
    if(!isBlocked) {
        // CREATE BLOCK
        const block = await blockedAccount.create({
            userId: blockerId,
            blockedUser: userToBlock
        })

        res.status(200).json({
            status: 'success',
            message: `User blocked`
        })
    }else{
        // WHEN USER IS ALREADY BLOCKED
    res.status(400).json({ message: 'User already blocked '})
    }
        
}

exports.unblockUser = async (req,res) => {
    const { username } = req.params
    // FIND USER BY USERNAME
    const user = await User.findOne({
        where: {
            username: username
        }
    })
    if(!user) throw new appError('No user with that username', 404)

    // GET ID FROM USER 
    const userId = req.user.id 
    const userToUnblock = user.id 

    // UNBLOCK
    const unblock = await blockedAccount.destroy({
        where: {
            blockedUser: userToUnblock
        }
    })

    // if no record
    if(!unblock) throw new appError('Cannot unblock', 400)
    
    res.status(200).json({
        status: 'success',
        message: 'User unblocked'
    })
}

// ACCESS CONTROL FOR BLOCKED USERS
// exports.getUser = async (req,res) => {
//     // Find the user to be displayed
//     const user = await User.findOne({ where: { username: req.params.username } });
//     const userProfile = await Profile.findOne({ where: { userId: user.id }})
//     // logger.info(user.displayName)
//     // Check if the user has been blocked
//     const isBlocked = await blockedAccount.findOne({ 
//       where: {
//         blockedUser: req.user.id, //user.id,
//         userId: user.id //req.user.id
//       } 
//     });

//     // If the user has been blocked, return a status code of 401 (Unauthorized)
//     if (isBlocked) return res.status(401).json({
//         status: 'failed',
//         message: 'Unauthorized'
//     });

//     // Continue with rendering the user's information
//     res.status(200).json({
//         data: {
//             userProfile
//         }
//     });
// }