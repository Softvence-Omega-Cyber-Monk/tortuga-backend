import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middlewares/auth";
import { authorizeRoles } from "../../middlewares/roleAuth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Bad request or validation error
 */
router.post("/register", userController.registerCustomer);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and receive access/refresh tokens
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or missing refresh token
 */
router.post("/refresh-token", userController.refreshToken);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user and clear cookies
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: Failed to logout
 */
router.post("/logout", verifyToken, userController.logout);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: janedoe@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 */
router.patch("/profile", verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change logged-in user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPass123
 *               newPassword:
 *                 type: string
 *                 example: newPass456
 *               confirmPassword:
 *                 type: string
 *                 example: newPass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation or password mismatch error
 */
router.put("/change-password", verifyToken, userController.changePassword);

/**
 * @swagger
 * /api/users/customers:
 *   get:
 *     summary: Get all customers (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all customers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/customers", verifyToken, authorizeRoles("ADMIN"), userController.getAllCustomers);

export const UserRoutes = router;


// import { Router } from "express";
// import { userController } from "./user.controller";
// import { verifyToken } from "../../middlewares/auth";
// import { authorizeRoles } from "../../middlewares/roleAuth";

// const router = Router()

// router.post("/register", userController.registerCustomer);
// router.post("/login", userController.login)
// router.post("/refresh-token", userController.refreshToken)
// router.post("/logout", verifyToken, userController.logout)
// router.get("/profile", verifyToken, userController.getProfile)
// router.patch("/profile", verifyToken, userController.updateUser)
// router.put("/change-password", verifyToken, userController.changePassword)
// router.get("/customers", verifyToken, authorizeRoles("ADMIN"), userController.getAllCustomers)

// export const UserRoutes = router