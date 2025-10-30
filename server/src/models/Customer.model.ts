import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  addresses: IAddress[];
  prescriptions: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  cartItems: any[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  label: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

const CustomerSchema = new Schema<ICustomer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  addresses: [AddressSchema],
  prescriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  cartItems: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
