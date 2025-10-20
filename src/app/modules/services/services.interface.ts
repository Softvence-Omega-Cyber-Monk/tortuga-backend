// src/modules/service/service.interface.ts
export interface IService {
  title: string;
  description: string;
  details: string;
  products: string[],
  imageUrl: string,
  createdAt: Date;
  updatedAt: Date;
}
