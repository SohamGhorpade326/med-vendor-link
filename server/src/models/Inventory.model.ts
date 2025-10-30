import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  quantity: number;
  lowStockThreshold: number;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
  updateStock(quantity: number): Promise<void>;
  checkLowStock(): boolean;
}

const InventorySchema = new Schema<IInventory>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update stock
InventorySchema.methods.updateStock = async function(quantity: number): Promise<void> {
  this.quantity += quantity;
  if (quantity > 0) {
    this.lastRestocked = new Date();
  }
  await this.save();
};

// Method to check low stock
InventorySchema.methods.checkLowStock = function(): boolean {
  return this.quantity <= this.lowStockThreshold;
};

InventorySchema.index({ vendorId: 1 });

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
