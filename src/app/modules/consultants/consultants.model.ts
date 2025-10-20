// src/modules/consultant/consultant.model.ts
import { Schema, model } from "mongoose";
import { IConsultant } from "./consultants.interface";

const ConsultantSchema = new Schema<IConsultant>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: String,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export const Consultant = model<IConsultant>("Consultant", ConsultantSchema);
