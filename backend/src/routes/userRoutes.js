const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateUserUpdate = require("../middlewares/validateUserUpdate");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", requireAuth, userController.getUsers);
router.get("/:id", requireAuth, userController.getUserById);
router.put("/:id", requireAuth, validateUserUpdate, userController.updateUser);
router.delete("/:id", requireAuth, userController.deleteUser);

module.exports = router;
