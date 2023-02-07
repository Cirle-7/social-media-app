//This file contains functions to generate tokens for our application such as OTPS, SMS Verifications, Email Verifications, Reset Password Tokens
const crypto = require("crypto");

//CREATE A FUNCTION TO CREATE PASSWORD RESET TOKEN
exports.createPasswordResetToken = async () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return { resetToken, passwordToken, passwordResetExpires };
};
