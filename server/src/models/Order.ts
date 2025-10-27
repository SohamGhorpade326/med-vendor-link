import mongoose, { Schema, Document } from 'mongoose';
import { IAddress } from './CustomerProfile';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  shippingAddress: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'CustomerProfile',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'VendorProfile',
    required: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  taxes: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'placed'
  },
  shippingAddress: {
    label: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);
