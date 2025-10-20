import { Router } from "express";
import { serviceController } from "./services.controller";
import multer from "multer";

const router = Router();
const upload = multer({dest: "uploads/"})

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management APIs (Admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the service
 *         title:
 *           type: string
 *           description: Title of the service
 *         description:
 *           type: string
 *           description: Short description about the service
 *         details:
 *           type: string
 *           description: Detailed information about the service
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: Related product IDs
 *         imageUrl:
 *           type: string
 *           description: Uploaded image URL of the service
 *       example:
 *         _id: "6712b4a85fc9a8123456789a"
 *         title: "Server Configuration"
 *         description: "We configure your dedicated or cloud servers."
 *         details: "Includes setup, optimization, and security hardening."
 *         products: ["670abfcd12de456789ab3456"]
 *         imageUrl: "https://res.cloudinary.com/demo/image/upload/service.jpg"
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - details
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Server Setup"
 *               description:
 *                 type: string
 *                 example: "Complete server installation and configuration"
 *               details:
 *                 type: string
 *                 example: "Includes firewall setup, SSL, and monitoring"
 *               products:
 *                 type: string
 *                 description: Comma-separated product IDs or JSON array string
 *                 example: "670abfcd12de456789ab3456,670abfcd12de456789ab3457"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid input
 */
router.post("/", upload.single("image"), serviceController.createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get("/", serviceController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get("/:id", serviceController.getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               details:
 *                 type: string
 *               products:
 *                 type: string
 *                 description: Comma-separated product IDs or JSON array string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.patch("/:id", upload.single("image"), serviceController.updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete("/:id", serviceController.deleteService);

export const ServiceRoutes = router;