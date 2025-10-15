// src/modules/consultant/consultant.interface.ts
export interface IConsultant {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
