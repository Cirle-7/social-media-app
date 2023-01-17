const Joi = require('joi')


const userValidator = Joi.object({
    username: Joi.string(),
    password: Joi.string()
})


// a validation middleware for the inputs 
const userValidationMiddleware = async(req,res,next)=>{
 const payload = req.body
 try {
    await userValidator.validateAsync(authorPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }

}

module.exports = {userValidationMiddleware}