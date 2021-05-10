const express = require("express");
const { addAwsCredentials } = require("../controller/userController");
const router = express.Router();
const authentication = require("./../controller/authController");

router.post("/signup", authentication.signupController);
router.post("/login", authentication.loginController);
router.get("/logout", authentication.protect, authentication.logoutController);
router.get("/me",authentication.protect, authentication.getMe);
router.patch("/awsCredentials", authentication.protect, addAwsCredentials)

module.exports= router;