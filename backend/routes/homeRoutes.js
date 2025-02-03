const express = require("express");

const { signupUser, signupSeller, login } = require("../controllers/homeController/authController");
const { uploadFile } = require("../controllers/authFileController")

const router = express.Router();

// login/signup routes
router.post("/signup_user", signupUser);
router.post("/signup_seller", signupSeller)
router.post("/login", login)
router.post("/upload/:type", uploadFile);

module.exports = router;



