import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'order' | 'payment' | 'inventory' | 'prescription' | 'system';
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedModel?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  markAsRead(): Promise<void>;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'payment', 'inventory', 'prescription', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: Schema.Types.ObjectId
  },
  relatedModel: {
    type: String,
    enum: ['Order', 'Payment', 'Inventory', 'Prescription']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Method to mark notification as read
NotificationSchema.methods.markAsRead = async function(): Promise<void> {
  this.isRead = true;
  await this.save();
};

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
