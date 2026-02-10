import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  subscription: "free" | "pro" | "business";
  status: "active" | "suspended" | "banned";
  subscriptionPlan?: "monthly" | "yearly";
  subscriptionStatus?: "active" | "cancelled" | "expired" | "past_due";
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "cancelled", "expired", "past_due"],
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
