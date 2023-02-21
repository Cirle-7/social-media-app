const Joi = require("joi");

const postValidator = Joi.object({
  body:Joi.string(),

  media_url: Joi.string(),

});

// a validation middleware for the inputs
const postValidationMiddleware = async (req, res, next) => {
  const postPayload = req.body;
  try {
    await postValidator.validateAsync(postPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
};

const updatePostValidator = Joi.object({
  body: Joi.string(),

  media_url: Joi.string(),
})

const updatePostValidatorMiddleware = async(req,res,next) => {
  const postPayload = req.body;
  try {
    await updatePostValidator.validateAsync(postPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = { postValidationMiddleware, updatePostValidatorMiddleware };
