import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorProfile extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorProfileSchema = new Schema<IVendorProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IVendorProfile>('VendorProfile', VendorProfileSchema);
