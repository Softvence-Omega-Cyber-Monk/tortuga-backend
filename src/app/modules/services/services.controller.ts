// src/modules/service/service.controller.ts
import { Request, Response, NextFunction } from "express";
import { serviceService } from "./services.service";


export class ServiceController {
  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.createService(req.body);
      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json({
        success: true,
        message: "Services fetched successfully",
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await serviceService.getServiceById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Service fetched successfully",
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await serviceService.updateService(id, req.body);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await serviceService.deleteService(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Service deleted successfully",
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
