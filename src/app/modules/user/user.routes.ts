import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../middlewares/auth";
import { authorizeRoles } from "../../middlewares/roleAuth";

const router = Router()

router.post("/register", userController.registerCustomer);
router.post("/login", userController.login)
router.post("/refresh-token", userController.refreshToken)
router.post("/logout", verifyToken, userController.logout)
router.get("/profile", verifyToken, userController.getProfile)
router.patch("/profile", verifyToken, userController.updateUser)
router.put("/change-password", verifyToken, userController.changePassword)
router.get("/customers", verifyToken, authorizeRoles("ADMIN"), userController.getAllCustomers)

export const UserRoutes = router