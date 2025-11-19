export interface ISelectedProduct {
  category: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  attributes?: Record<string, any>;
}

export interface IConfigurator {
  name: string;
  email: string;
  phone: string;
  selectedProducts: ISelectedProduct[];
  totalPrice: number;
  createdAt?: Date;
}