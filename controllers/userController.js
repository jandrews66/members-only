/* const User = require("../models/user")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.user_signup_get = asyncHandler(async (req, res, next) => {
    res.render("signup_form")
});

exports.user_signup_post = asyncHandler(async (req, res, next) => {
    try {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password
        });
        const result = await user.save();
        res.redirect("/");
      } catch(err) {
        return next(err);
      };
})

exports.user_login_get = asyncHandler(async (req, res, next) => {
    res.render("login_form")
});

exports.user_login_post = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login"
      })
});

 */