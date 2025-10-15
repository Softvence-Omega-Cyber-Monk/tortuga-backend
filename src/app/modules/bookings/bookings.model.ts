import { Schema, model } from "mongoose";
import { IBooking } from "./bookings.interface";

const BookingProductSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const BookingSchema = new Schema<IBooking>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    products: {
      type: [BookingProductSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
