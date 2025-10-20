export interface IConfigurationProduct {
  productId: string;
  productName: string;
  category: string;
  price: number;
  sku: string;
  attributes?: Record<string, any>;
}

export interface IGuestUserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IConfiguration {
  userId?: string; // Optional - only for logged-in users
  guestUserInfo?: IGuestUserInfo; // Optional - only for guest users
  products: IConfigurationProduct[];
  totalPrice: number;
  configurationDate: Date;
  status: 'draft' | 'completed' | 'ordered';
  notes?: string;
}