// src/modules/product/product.model.ts

import { Schema, model } from "mongoose";
import { IProduct, ProductCategory } from "./product.interface";

const CompatibilityRuleSchema = new Schema({
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: true,
  },
  requiredAttributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, { _id: false });

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: [true, "Product category is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    company: {
      type: String,
      required: [true, "Company Name is required"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: [true, "Product attributes are required"],
    },
    compatibilityRules: {
      type: [CompatibilityRuleSchema],
      default: [],
    },
    keyFeatures: {
      type: [String],
      required: false,
      default: [],
      trim: true,
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEOL: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ "attributes.brand": 1 });
ProductSchema.index({ "attributes.family": 1 });

export const Product = model<IProduct>("Product", ProductSchema);