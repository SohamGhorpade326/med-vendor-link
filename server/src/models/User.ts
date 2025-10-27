import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  role: 'customer' | 'vendor';
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: ['customer', 'vendor'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
