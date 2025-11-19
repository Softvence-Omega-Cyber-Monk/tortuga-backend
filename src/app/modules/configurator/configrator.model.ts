import mongoose, { Schema, Document } from 'mongoose';
import { IConfigurator } from './configurator.interface';

export interface IConfiguratorDocument extends IConfigurator, Document {}

const SelectedProductSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  attributes: { type: Schema.Types.Mixed }
}, { _id: false });

const ConfiguratorSchema = new Schema<IConfiguratorDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    selectedProducts: {
      type: [SelectedProductSchema],
      required: true,
      validate: {
        validator: function(v: any[]) {
          return v && v.length > 0;
        },
        message: 'At least one product must be selected'
      }
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes for better query performance
ConfiguratorSchema.index({ email: 1, createdAt: -1 });
ConfiguratorSchema.index({ createdAt: -1 });

export const Configurator = mongoose.model<IConfiguratorDocument>(
  'Configurator',
  ConfiguratorSchema
);