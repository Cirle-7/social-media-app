<<<<<<< HEAD
const router = require("express").Router();
const authController = require("../controllers/authController");
const { userValidationMiddleware } = require("../validation/userValidation");
require("../utils/passportOAuth");
const passport = require("passport");
=======
const router = require('express').Router()
const authController = require('../controllers/authController')
const { userValidationMiddleware } = require('../validation/userValidation')
require('../utils/passportOAuth')
const passport = require('passport')
const {socialAuth}  = require('../controllers/socialAuthController')
>>>>>>> 4302f00370b62d01608546b994557f4f10b6ac06

//AUTHENTIACTION ROUTES
router.post("/signup", userValidationMiddleware, authController.signup);
router.post("/login", authController.login);
router.patch("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

//GOOGLE OAUTH
<<<<<<< HEAD
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

//GITHUB OAUTH
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//OAUTH CALLBACKS
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Here now!");
    return res.redirect("/api/v1/users/protected");
  }
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Here now!");
    return res.redirect("/api/v1/users/protected");
  }
);

// TODO:
// AUTHORIZATION TO PROTECTED ROUTES
router.get("/protected", authController.profile);

// LOGOUT - DESTROY SESSION
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    return res.redirect("/");
  });
});
=======
router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))

//GITHUB OAUTH
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email']}))

//OAUTH CALLBACKS
router.get('/auth/google/callback', passport.authenticate('google',{session:false}),socialAuth)

router.get('/auth/github/callback', passport.authenticate('github',{session:false}),socialAuth)

// LOGOUT - DESTROY SESSION
router.get('/logout', (req, res, next) => {
     return res.clearCookie('jwt').redirect('/');
   
})
>>>>>>> 4302f00370b62d01608546b994557f4f10b6ac06

module.exports = router;
