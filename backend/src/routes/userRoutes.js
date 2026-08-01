const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", requireAuth, userController.getUsers);
router.get("/:id", requireAuth, userController.getUserById);

module.exports = router;
