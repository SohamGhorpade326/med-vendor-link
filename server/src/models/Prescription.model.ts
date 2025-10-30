import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  customerId: mongoose.Types.ObjectId;
  doctorName: string;
  doctorLicense: string;
  prescriptionDate: Date;
  validUntil: Date;
  medications: {
    productId: mongoose.Types.ObjectId;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  imageUrl?: string;
  isVerified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  verify(adminId: mongoose.Types.ObjectId): Promise<void>;
  isValid(): boolean;
}

const PrescriptionSchema = new Schema<IPrescription>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  doctorLicense: {
    type: String,
    required: true
  },
  prescriptionDate: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  medications: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  imageUrl: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Method to verify prescription
PrescriptionSchema.methods.verify = async function(adminId: mongoose.Types.ObjectId): Promise<void> {
  this.isVerified = true;
  this.verifiedBy = adminId;
  this.verifiedAt = new Date();
  await this.save();
};

// Method to check if prescription is valid
PrescriptionSchema.methods.isValid = function(): boolean {
  return this.isVerified && new Date() <= this.validUntil;
};

PrescriptionSchema.index({ customerId: 1, createdAt: -1 });

export const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
