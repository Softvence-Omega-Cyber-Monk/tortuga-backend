export interface IBookingProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IBooking {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  products: IBookingProduct[];
  createdAt: Date;
  updatedAt: Date;
}
