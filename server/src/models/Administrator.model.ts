import mongoose, { Schema, Document } from 'mongoose';

export interface IAdministrator extends Document {
  userId: mongoose.Types.ObjectId;
  permissions: string[];
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdministratorSchema = new Schema<IAdministrator>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'verify_prescriptions',
      'verify_vendors',
      'view_reports',
      'manage_products',
      'handle_disputes',
      'system_settings'
    ]
  }],
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Administrator = mongoose.model<IAdministrator>('Administrator', AdministratorSchema);
