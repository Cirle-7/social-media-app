const Joi = require("joi");

const userValidator = Joi.object({
  email: Joi.string().email(),

  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  confirm_password: Joi.ref("password"),

  displayName: Joi.string().alphanum().min(1).max(30).required(),
  passwordResetToken: [Joi.string(), Joi.number()],
  passwordResetExpires: Joi.date(),
});

// a validation middleware for the inputs
const userValidationMiddleware = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
};

module.exports = { userValidationMiddleware };
