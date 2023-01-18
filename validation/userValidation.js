const Joi = require('joi')


const userValidator = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email(),
        
    displayName: Joi.string()
        .alphanum()
        .min(1)
        .max(30)
        .required()
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