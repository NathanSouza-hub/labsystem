const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const validateProduct = require("../middlewares/validateProduct");
const requireAuth = require("../middlewares/requireAuth");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", requireAuth, validateProduct, productController.createProduct);
router.put("/:id", requireAuth, validateProduct, productController.updateProduct);
router.delete("/:id", requireAuth, productController.deleteProduct);

module.exports = router;
