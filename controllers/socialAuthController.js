require('express-async-errors')
require("dotenv").config();


const socialAuth = async (req, res) => {
    const {
        user: { user, token, oldUser }
    } = req;

    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token to client
    res.cookie("jwt", token, cookieOptions);

    const currentUser = user || oldUser
    

    res.status(201).json({
        status: "Success",
        data: {
            currentUser,
            token,
        },
    });
}



module.exports = { socialAuth }