import { IService } from "./services.interface";
import { Service } from "./services.model";


export class ServiceService {
  // Create service
  async createService(payload: Partial<IService>): Promise<IService> {
    const service = await Service.create(payload);
    return service;
  }

  // Get all services
  async getAllServices(): Promise<IService[]> {
    const services = await Service.find().populate("products");
    return services;
  }

  // Get single service by ID
  async getServiceById(id: string): Promise<IService | null> {
    const service = await Service.findById(id).populate("products");
    return service;
  }

  // Update service
  async updateService(id: string, payload: Partial<IService>): Promise<IService | null> {
    const service = await Service.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return service;
  }

  // Delete service
  async deleteService(id: string): Promise<IService | null> {
    const service = await Service.findByIdAndDelete(id);
    return service;
  }
}

export const serviceService = new ServiceService();
