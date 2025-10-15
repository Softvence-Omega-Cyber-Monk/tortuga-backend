// src/modules/service/service.route.ts
import { Router } from "express";
import { serviceController } from "./services.controller";

const router = Router();

router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

export const ServiceRoutes = router;
