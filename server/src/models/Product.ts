import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  composition: string;
  price: number;
  quantity: number;
  batchNumber: string;
  expiryDate: Date;
  requiresPrescription: boolean;
  imageUrl: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'VendorProfile',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  composition: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  batchNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    required: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

// Validation: Cannot add expired medicines
ProductSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    next(new Error('Cannot add expired medicine'));
  }
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
