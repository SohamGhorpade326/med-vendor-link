import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface ICustomerProfile extends Document {
  user: mongoose.Types.ObjectId;
  addresses: IAddress[];
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  label: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
}, { _id: false });

const CustomerProfileSchema = new Schema<ICustomerProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  addresses: [AddressSchema],
  phone: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICustomerProfile>('CustomerProfile', CustomerProfileSchema);
