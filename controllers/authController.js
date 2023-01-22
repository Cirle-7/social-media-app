const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const appError = require('../utils/appError')
const logger = require('../utils/logger')
const db = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

// User model
const User = db.users

const signup = catchAsync(async (req,res) => {
    // console.log(req.headers)
    // logger.info(req.body)
    try {
        const { username, email,password,displayName } = req.body
        
        // // validate input
        if(!(username && email && password && displayName)){
            res.status(400).json({
                status: 'Failed',
                message: 'All fields are required'
            })
        }
        // check if user already exist
        const oldUser = await User.findOne({
            where: { email: email }
        })
        if(oldUser){
            res.status(409).json({
                status: 'failed',
                message: 'User already exists. Please login'
            })
        }

        // hashPassword
        const hashedPassword = await bcrypt.hash(password,12)
        // if new user create
        const user = await User.create({
            username: username,
            email: email,
            displayName: displayName,
            password: hashedPassword
        })

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        )

        const cookieOptions = {
            expires: new Date(
                Date.now() + 1 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

        // Send token to client
        res.cookie('jwt', token, cookieOptions);

        res.status(201).json({
            status: 'success',
            message: 'signup successful',
            data: {
                user, token
            }
        })
        // logger.info('user created')
    } catch (err) {
        res.status(500).json({
            message: 'oops something went wrong',
            data: err.message
        })
    }
})


const login = catchAsync(async (req, res) => {

    try {
      // Get user input
      const { email, password } = req.body;
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in database
    const user = await User.findOne({
        where: { email: email }
    })
    // console.log(user)
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
      const token = jwt.sign(
        { user_id: user.id },
        process.env.JWT_SECRET,
        {
           expiresIn: process.env.JWT_EXPIRES
        }
    );
  
        // save user token
        user.token = token;
        const cookieOptions = {
            expires: new Date(
            //   Date.now() + process.env.jwt_cookie_expires * 60 * 60 * 1000
                Date.now() + 1 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        
        //   //Send Token To Client
        res.cookie('jwt', token, cookieOptions);

        // user
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                userId: user.id,
                email: user.email,
                token
            }
        });
      }else{
        res.status(400).json({
            message: 'Incorrect login details'
        });
      }
      
    } catch (err) {
      console.log(err);
    }
});

const authorize = catchAsync(async (req,res,next) => {
    try{

        /** testing authorization**/ 
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({
                status: 403,
                message: "FORBIDDEN",
            });
        }

        const token = authHeader.split(" ")[1];

        // // verify token
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    
        //Check if user exists
        const currentUser = await User.findOne({
            where: { id : verifyToken.user.id }
        }) 
        
        if (!currentUser)
        return next(new appError(404, 'Session expired, Login again!'));

        //Add user to req object
        req.user = currentUser;
        next();
        /** end of **/
    } catch(err){
        res.status(500).json({
            message: 'error',
            data: err
        })
    }
})

// TO DO
// reset password
// forgot password
// logout?

module.exports = {
    signup,
    login,
    authorize
}
