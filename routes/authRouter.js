const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

// Define authentication routes
router.post("/signup", authController.signUp);
router.post("/login", authController.login);

module.exports = router;
