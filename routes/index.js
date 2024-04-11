const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require("../models/user");


router.get("/", (req, res) => {
  res.render('index', { title: 'Members Only' });
});

router.get("/sign-up", (req, res) => res.render("signup_form"));

router.post("/sign-up", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
          console.log(err);
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
          return next(err);
      }
  });
});

router.get("/log-in", (req, res) => res.render("login_form"))

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
