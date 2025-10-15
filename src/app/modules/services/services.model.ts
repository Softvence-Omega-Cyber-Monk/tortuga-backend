// src/modules/service/service.model.ts
import { model, Schema } from "mongoose";
import { IService } from "./services.interface";

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", ServiceSchema);
