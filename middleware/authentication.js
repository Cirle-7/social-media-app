const jwt = require('jsonwebtoken')
const AppError = require("../utils/appError");
require("express-async-errors");



const authorize = async (req, res, next) => {
    /** testing authorization**/
    const authHeader = req.headers.authorization;
    if (!authHeader)
    throw new AppError("FORBIDDEN", 403);


    const token = authHeader.split(" ")[1];

    // // verify token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    //Check if user exists
    const currentUser = await User.findOne({
      where: { id: verifyToken.user.id },
    });

    if (!currentUser)
      throw new AppError(404, "Session expired, Login again!");

    //Add user to req object
    req.user = currentUser;
    next();
}

module.exports = authorize