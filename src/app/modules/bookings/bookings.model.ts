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
    service: {
      type: String,
      required: true,
      enum: [
        'Custom Server',
        'GPU Rental',
        'KVM Instance',
        'Onsite Warranty',
        'Onsite Maintenance',
        'Server Relocation',
        'Other'
      ]
    },
    status: {
      type: String,
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

export const Booking = model<IBooking>("Booking", BookingSchema);