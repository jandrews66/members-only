const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController")

router.get("/", user_controller.index_get);

router.post("/", user_controller.index_post);

router.get("/sign-up", user_controller.signup_get);

router.post("/sign-up", user_controller.signup_post);

router.get("/log-in", user_controller.login_get)

router.post("/log-in", user_controller.login_post)

router.get("/log-out", user_controller.logout_get)

router.get("/member", user_controller.member_get);

router.post("/member", user_controller.member_post);

router.get("/admin", user_controller.admin_form_get);

router.post("/admin", user_controller.admin_form_post);

router.get("/admin/dashboard", user_controller.admin_dashboard_get);

router.post("/admin/dashboard", user_controller.admin_dashboard_post);

module.exports = router;
