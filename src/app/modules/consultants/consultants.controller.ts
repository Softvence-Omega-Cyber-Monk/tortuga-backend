// src/modules/consultant/consultant.controller.ts
import { Request, Response, NextFunction } from "express";
import { consultantService } from "./consultants.service";

export class ConsultantController {
  async createConsultant(req: Request, res: Response, next: NextFunction) {
    try {
      const consultant = await consultantService.createConsultant(req.body);
      res.status(201).json({
        success: true,
        message: "Consultation request submitted successfully",
        data: consultant,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllConsultants(req: Request, res: Response, next: NextFunction) {
    try {
      const consultants = await consultantService.getAllConsultants();
      res.status(200).json({
        success: true,
        message: "Consultation requests fetched successfully",
        data: consultants,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConsultantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const consultant = await consultantService.getConsultantById(id);

      if (!consultant) {
        return res.status(404).json({
          success: false,
          message: "Consultation request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Consultation request fetched successfully",
        data: consultant,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateConsultant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const consultant = await consultantService.updateConsultant(id, req.body);

      if (!consultant) {
        return res.status(404).json({
          success: false,
          message: "Consultation request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Consultation request updated successfully",
        data: consultant,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteConsultant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const consultant = await consultantService.deleteConsultant(id);

      if (!consultant) {
        return res.status(404).json({
          success: false,
          message: "Consultation request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Consultation request deleted successfully",
        data: consultant,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const consultantController = new ConsultantController();
