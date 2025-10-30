import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  shippingAddress: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  calculateTotal(): number;
  updateStatus(status: string): Promise<void>;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, required: true }
});

const OrderSchema = new Schema<IOrder>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxes: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
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
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  trackingNumber: String
}, {
  timestamps: true
});

// Method to calculate total
OrderSchema.methods.calculateTotal = function(): number {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.taxes = this.subtotal * 0.18; // 18% GST
  this.total = this.subtotal + this.taxes;
  return this.total;
};

// Method to update status
OrderSchema.methods.updateStatus = async function(status: string): Promise<void> {
  this.orderStatus = status;
  await this.save();
};

OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ vendorId: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
