import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentGateway?: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
  processPayment(): Promise<boolean>;
  refund(): Promise<boolean>;
}

const PaymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentGateway: String,
  gatewayResponse: Schema.Types.Mixed
}, {
  timestamps: true
});

// Method to process payment
PaymentSchema.methods.processPayment = async function(): Promise<boolean> {
  try {
    // Simulate payment processing
    this.status = 'completed';
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    await this.save();
    return true;
  } catch (error) {
    this.status = 'failed';
    await this.save();
    return false;
  }
};

// Method to refund payment
PaymentSchema.methods.refund = async function(): Promise<boolean> {
  if (this.status !== 'completed') {
    return false;
  }
  
  this.status = 'refunded';
  await this.save();
  return true;
};

PaymentSchema.index({ customerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
