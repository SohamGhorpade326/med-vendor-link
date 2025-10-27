import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "vendor" | "customer";
  vendorProfile?: mongoose.Types.ObjectId;
  customerProfile?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["vendor", "customer"],
      required: true,
      default: "customer",
    },
    vendorProfile: {
      type: Schema.Types.ObjectId,
      ref: "VendorProfile",
      default: null,
    },
    customerProfile: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
