// src/modules/consultant/consultant.service.ts
import { Consultant } from "./consultants.model";
import { IConsultant } from "./consultants.interface";

export class ConsultantService {
  async createConsultant(payload: Partial<IConsultant>): Promise<IConsultant> {
    const consultant = await Consultant.create(payload);
    return consultant;
  }

  async getAllConsultants(): Promise<IConsultant[]> {
    const consultants = await Consultant.find().sort({ createdAt: -1 });
    return consultants;
  }

  async getConsultantById(id: string): Promise<IConsultant | null> {
    const consultant = await Consultant.findById(id);
    return consultant;
  }

  async updateConsultant(id: string, payload: Partial<IConsultant>): Promise<IConsultant | null> {
    const consultant = await Consultant.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return consultant;
  }

  async deleteConsultant(id: string): Promise<IConsultant | null> {
    const consultant = await Consultant.findByIdAndDelete(id);
    return consultant;
  }
}

export const consultantService = new ConsultantService();
