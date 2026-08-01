const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateAuth = require("../middlewares/validateAuth");

router.post("/register", validateAuth, authController.register);
router.post("/login", validateAuth, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

module.exports = router;
