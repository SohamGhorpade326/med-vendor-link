import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesReport extends Document {
  vendorId: mongoose.Types.ObjectId;
  reportType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalOrders: number;
  totalRevenue: number;
  totalTaxes: number;
  productSales: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantitySold: number;
    revenue: number;
  }[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  generate(): Promise<void>;
}

const SalesReportSchema = new Schema<ISalesReport>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  reportType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalTaxes: {
    type: Number,
    default: 0
  },
  productSales: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    revenue: { type: Number, required: true }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to generate report
SalesReportSchema.methods.generate = async function(): Promise<void> {
  const Order = mongoose.model('Order');
  
  const orders = await Order.find({
    vendorId: this.vendorId,
    createdAt: { $gte: this.startDate, $lte: this.endDate },
    orderStatus: { $in: ['completed', 'shipped'] }
  });

  this.totalOrders = orders.length;
  this.totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  this.totalTaxes = orders.reduce((sum, order) => sum + order.taxes, 0);

  // Aggregate product sales
  const productMap = new Map();
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      const key = item.productId.toString();
      if (productMap.has(key)) {
        const existing = productMap.get(key);
        existing.quantitySold += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productMap.set(key, {
          productId: item.productId,
          productName: item.name,
          quantitySold: item.quantity,
          revenue: item.price * item.quantity
        });
      }
    });
  });

  this.productSales = Array.from(productMap.values());
  this.generatedAt = new Date();
  await this.save();
};

SalesReportSchema.index({ vendorId: 1, reportType: 1, startDate: -1 });

export const SalesReport = mongoose.model<ISalesReport>('SalesReport', SalesReportSchema);
