const Joi = require('joi')


const profileValidator = Joi.object({
    Bio: Joi.string().required(),
    website: Joi.string(),
    location: Joi.string(),
    github_link: Joi.string(),
    twitter_link:Joi.string(),
    headerURL: Joi.string(),
    avatarURL: Joi.string(),
    followers: Joi.string()
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