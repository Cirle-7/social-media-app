const Joi = require('joi')


const profileValidator = Joi.object({
    description: Joi.object({
        bio: Joi.string()
            .alphanum(),
        website: Joi.string()
    }), 
    avatarURL: Joi.string(),
    headerURL: Joi.string(),
    displayName: Joi.string()
        .alphanum()
        .min(1)
        .max(30)
        .required()
})


// a validation middleware for the inputs 
const profileValidationMiddleware = async(req,res,next)=>{
 const payload = req.body
 try {
    await profileValidator.validateAsync(payload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }

}

module.exports = {profileValidationMiddleware}