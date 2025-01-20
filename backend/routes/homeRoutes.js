const express = require("express");

const { signupUser, signupSeller, login } = require("../controllers/homeController/authController");

const router = express.Router();

// login/signup routes
router.post("/signup_user", signupUser);
router.post("/signup_seller", signupSeller)
router.post("/login", login)

module.exports = router;



