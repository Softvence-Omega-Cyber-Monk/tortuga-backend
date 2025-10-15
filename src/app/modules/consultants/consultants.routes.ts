// src/modules/consultant/consultant.route.ts
import { Router } from "express";
import { consultantController } from "./consultants.controller";

const router = Router();

router.post("/", consultantController.createConsultant);
router.get("/", consultantController.getAllConsultants);
router.get("/:id", consultantController.getConsultantById);
router.patch("/:id", consultantController.updateConsultant);
router.delete("/:id", consultantController.deleteConsultant);

export const ConsultantRoutes = router;
