// src/modules/service/service.controller.ts
import { Request, Response, NextFunction } from "express";
import { serviceService } from "./services.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

export class ServiceController {
  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file as Express.Multer.File | undefined;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      const imageUrl = await uploadToCloudinary(file.path, "services");

      // Parse products - handle both comma-separated string and JSON array
      let products: string[] = [];
      if (req.body.products) {
        if (typeof req.body.products === 'string') {
          try {
            // Try parsing as JSON first
            products = JSON.parse(req.body.products);
          } catch {
            // If not JSON, split by comma
            products = req.body.products.split(',').map((id: string) => id.trim()).filter(Boolean);
          }
        } else if (Array.isArray(req.body.products)) {
          products = req.body.products;
        }
      }

      const serviceData = {
        title: req.body.title,
        description: req.body.description,
        details: req.body.details,
        products,
        imageUrl,
      };

      const service = await serviceService.createService(serviceData);
      
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
      const file = req.file as Express.Multer.File | undefined;

      let updateData: any = {};

      // Only include fields that are provided
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.details) updateData.details = req.body.details;

      // Handle products update
      if (req.body.products) {
        if (typeof req.body.products === 'string') {
          try {
            updateData.products = JSON.parse(req.body.products);
          } catch {
            updateData.products = req.body.products.split(',').map((id: string) => id.trim()).filter(Boolean);
          }
        } else if (Array.isArray(req.body.products)) {
          updateData.products = req.body.products;
        }
      }

      // Upload new image if provided
      if (file) {
        updateData.imageUrl = await uploadToCloudinary(file.path, "services");
      }

      const service = await serviceService.updateService(id, updateData);

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