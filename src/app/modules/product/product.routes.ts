// src/modules/product/product.routes.ts

import { Router } from "express";
import { productController } from "./product.controller";
import { multerUpload } from "../../middlewares/multer.upload";

const router = Router();

// Create product (with single image upload)
router.post(
  "/",
  multerUpload.single("image"),
  productController.createProduct
);

// Get all products with optional filters
router.get("/", productController.getAllProducts);

// Get all products grouped by category
router.get("/by-category", productController.getProductsByCategory);

// Search products
router.get("/search", productController.searchProducts);

// Get compatible products for configuration (multiple selected products)
router.post(
  "/compatible-configuration",
  productController.getCompatibleProductsForConfiguration
);

// Get product by ID
router.get("/:id", productController.getProductById);

// Update product (with optional image upload)
router.patch(
  "/:id",
  multerUpload.single("image"),
  productController.updateProduct
);

// Delete product
router.delete("/:id", productController.deleteProduct);

// Get compatible products for a single product
router.get("/:id/compatible", productController.getCompatibleProducts);

// Toggle product active status
router.patch("/:id/toggle-status", productController.toggleProductStatus);

// Toggle EOL status
router.patch("/:id/toggle-eol", productController.toggleEOLStatus);

export const ProductRoutes = router;