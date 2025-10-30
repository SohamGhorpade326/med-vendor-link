import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  licenseNumber: string;
  address: string;
  products: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);
