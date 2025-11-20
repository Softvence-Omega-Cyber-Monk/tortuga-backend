import { Router } from "express";
import { productController } from "./product.controller";
import { multerUpload } from "../../middlewares/multer.upload";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               company: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               sku: { type: string }
 *               attributes: { type: string }
 *               compatibilityRules: { type: string }
 *               keyFeatures: { type: string }
 *               isActive: { type: boolean }
 *               isEOL: { type: boolean }
 *               image: { type: string, format: binary }
 *               galleryImages: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/", 
  multerUpload.fields([
    { name: "image", maxCount: 1 }, 
    { name: "galleryImages", maxCount: 5 }
  ]), 
  productController.createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: isEOL
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/by-category:
 *   get:
 *     summary: Get products grouped by category
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products grouped by category
 */
router.get("/by-category", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", productController.searchProducts);

/**
 * @swagger
 * /api/products/compatible-configuration:
 *   post:
 *     summary: Get compatible products for multiple selected products
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items: { type: string }
 *             example:
 *               productIds: ["ID1", "ID2"]
 *     responses:
 *       200:
 *         description: Compatible products found
 */
router.post(
  "/compatible-configuration",
  productController.getCompatibleProductsForConfiguration
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               company: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               attributes: { type: string }
 *               compatibilityRules: { type: string }
 *               keyFeatures: { type: string }
 *               isActive: { type: boolean }
 *               isEOL: { type: boolean }
 *               image: { type: string, format: binary }
 *               galleryImages: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch(
  "/:id", 
  multerUpload.fields([
    { name: "image", maxCount: 1 }, 
    { name: "galleryImages", maxCount: 5 }
  ]), 
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/compatible:
 *   get:
 *     summary: Get compatible products for a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Compatible products list
 */
router.get("/:id/compatible", productController.getCompatibleProducts);

/**
 * @swagger
 * /api/products/{id}/toggle-status:
 *   patch:
 *     summary: Toggle product active status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product status toggled
 */
router.patch("/:id/toggle-status", productController.toggleProductStatus);

/**
 * @swagger
 * /api/products/{id}/toggle-eol:
 *   patch:
 *     summary: Toggle product EOL status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product EOL status toggled
 */
router.patch("/:id/toggle-eol", productController.toggleEOLStatus);

export const ProductRoutes = router;