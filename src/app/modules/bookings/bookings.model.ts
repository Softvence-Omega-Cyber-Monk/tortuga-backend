import { Schema, model } from "mongoose";
import { IBooking } from "./bookings.interface";

const BookingSchema = new Schema<IBooking>(
  {
    fullname: {
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
    status : {
      type: String,
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
