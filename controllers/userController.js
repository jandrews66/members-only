const express = require('express');
const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");



exports.index = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Members Only' });

})

exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render("signup_form")
})

exports.signup_post = [
    body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "Password must be at least 8 characters long.")
    .isLength({ min: 8 }),
    body("confirm_password", "Passwords must match").custom((value, { req }) => {
        return value === req.body.password;
      }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.render("signup_form", {errors: errors.array() });
        }
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                console.log("Error hashing password:", err);
                return next(err);
            }
            try {
                const user = new User({
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  username: req.body.username,
                  password: hashedPassword,
                });
                const result = await user.save();
                res.redirect("/");
            } catch (err) {
                console.log("Error saving user:", err)
                return next(err);
            }
        });
      })
] 

exports.login_get = asyncHandler(async (req, res, next) => res.render("login_form"))

exports.login_post = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })(req, res, next); // Call the middleware here
});

exports.logout_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

