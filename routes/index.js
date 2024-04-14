const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController")

router.get("/", user_controller.index);

router.get("/sign-up", user_controller.signup_get);

router.post("/sign-up", user_controller.signup_post);

router.get("/log-in", user_controller.login_get)

router.post("/log-in", user_controller.login_post)

router.get("/log-out", user_controller.logout_get)

module.exports = router;
