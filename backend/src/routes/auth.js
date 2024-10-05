const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { registerUser, loginUser } = require("../controllers/newAuthController.js")
const { auth } = require("../middleware/auth");

//router.post("/register", register);
router.post("/register", registerUser);
//router.post("/login", login);
router.post("/login", loginUser);

//router.post("/logout", auth, logout);
router.post("/logout", logout);

module.exports = router;
