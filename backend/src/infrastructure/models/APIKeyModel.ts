import mongoose, { Schema, Document } from "mongoose";

export interface IAPIKeyDocument extends Document {
  userId: mongoose.Types.ObjectId;
  secret: string;
  name: string;
  enabled: boolean;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const APIKeySchema = new Schema<IAPIKeyDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    secret: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

// Indexes
APIKeySchema.index({ userId: 1, enabled: 1 });
APIKeySchema.index({ secret: 1 }, { unique: true });

export const APIKeyModel = mongoose.model<IAPIKeyDocument>(
  "APIKey",
  APIKeySchema,
);
