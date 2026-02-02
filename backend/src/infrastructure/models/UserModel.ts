import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  isActive: boolean;
  onboardingCompleted: boolean;
  monthlyIncome?: number;
  financialGoals?: string[];
  coachPersonality?: string;
  wiseScore?: number;
  wiseScoreUpdatedAt?: Date;
  wiseScoreTier?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    monthlyIncome: { type: Number, required: false },
    financialGoals: { type: [String], default: undefined, required: false },
    coachPersonality: { type: String, required: false },
    wiseScore: { type: Number, required: false },
    wiseScoreUpdatedAt: { type: Date, required: false },
    wiseScoreTier: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
