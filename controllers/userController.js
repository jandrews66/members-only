const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const isAdmin = require("../routes/authMiddleware").isAdmin;


exports.index_get = asyncHandler(async (req, res, next) => {

    const allMessages = await Message.find().sort({ timestamp: -1}).populate("user").exec();
    
    res.render('index', { 
        title: 'Members Only',
        allMessages: allMessages 
    });

})

exports.index_post = [
    body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
    body("comment", "Comment must not be empty").trim().isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            res.render("index", { errors: errors.array() });
            return;
        }

        try {
            const message = new Message({
                title: req.body.title,
                comment: req.body.comment,
                user: res.locals.currentUser,
                timestamp: new Date()
            });

            console.log("New message object:", message);

            await message.save();

            console.log("Message saved successfully.");

            res.redirect("/");
        } catch (error) {
            console.error("Error saving message:", error);
            next(error);
        }
    })
];


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

exports.member_get = asyncHandler(async (req, res, next) => {
    res.render("member_form")
})

exports.member_post = [
    body("secret_code", "Wrong code").custom((value, { req }) => {
        return value === "1966";
      }),
      asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.render("member_form", {errors: errors.array()});
        }
        await User.findByIdAndUpdate(res.locals.currentUser, {isMember: true})

        res.redirect("/");

    })
]

exports.admin_form_get = asyncHandler(async (req, res, next) => {
    res.render('admin_form', { 
    });
})

exports.admin_form_post = asyncHandler(async (req, res, next) => {
        console.log(req.body.admin)     
        if (req.body.admin === "on"){
            await User.findByIdAndUpdate(res.locals.currentUser, {isAdmin: true})
        }
    res.render('admin_dashboard', { 
    });
})

exports.admin_dashboard_get = [
    isAdmin, //call admin middleware to 
    asyncHandler(async (req, res, next) => {
        const allMessages = await Message.find().sort({ timestamp: -1}).populate("user").exec();
    
        res.render('admin_dashboard', { 
            allMessages: allMessages,
        });
    })
]

exports.admin_dashboard_post = asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.body.messageid);
    res.redirect('/admin/dashboard')
})