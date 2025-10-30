import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  composition: string;
  price: number;
  batchNumber: string;
  expiryDate: Date;
  requiresPrescription: boolean;
  imageUrl: string;
  category?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
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
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

ProductSchema.index({ vendorId: 1, name: 1 });
ProductSchema.index({ category: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
