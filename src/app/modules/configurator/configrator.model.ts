import { Schema, model } from 'mongoose';
import { IConfiguration } from './configurator.interface';

const configurationProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  attributes: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const guestUserInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const configurationSchema = new Schema<IConfiguration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    guestUserInfo: {
      type: guestUserInfoSchema,
      required: false
    },
    products: {
      type: [configurationProductSchema],
      required: true,
      validate: {
        validator: function(products: any[]) {
          return products.length > 0;
        },
        message: 'Configuration must have at least one product'
      }
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    configurationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'ordered'],
      default: 'completed'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
configurationSchema.index({ userId: 1, configurationDate: -1 });
configurationSchema.index({ 'guestUserInfo.email': 1 });
configurationSchema.index({ status: 1 });

// Validation: Either userId or guestUserInfo must be present
configurationSchema.pre('save', function(next) {
  if (!this.userId && !this.guestUserInfo) {
    next(new Error('Either userId or guestUserInfo must be provided'));
  } else if (this.userId && this.guestUserInfo) {
    next(new Error('Cannot have both userId and guestUserInfo'));
  } else {
    next();
  }
});

export const Configuration = model<IConfiguration>('Configuration', configurationSchema);
