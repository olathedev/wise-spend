import mongoose, { Schema, Document } from "mongoose";

export type CommitmentStatusType = "active" | "completed" | "abandoned";

export interface ICommitmentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  weekOf: string; // YYYY-MM-DD
  commitmentText: string;
  status: CommitmentStatusType;
  midWeekCheckInDate?: Date;
  midWeekResponse?: string;
  midWeekReminderSentAt?: Date;
  aiObservations: string[];
  completionSelfReport?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommitmentSchema = new Schema<ICommitmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weekOf: {
      type: String,
      required: true,
      index: true,
    },
    commitmentText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
      index: true,
    },
    midWeekCheckInDate: { type: Date, required: false },
    midWeekResponse: { type: String, required: false },
    midWeekReminderSentAt: { type: Date, required: false },
    aiObservations: {
      type: [String],
      default: [],
    },
    completionSelfReport: { type: String, required: false },
  },
  { timestamps: true },
);

CommitmentSchema.index({ userId: 1, weekOf: 1 }, { unique: true });
CommitmentSchema.index({ userId: 1, status: 1 });

export const CommitmentModel = mongoose.model<ICommitmentDocument>(
  "Commitment",
  CommitmentSchema,
);
