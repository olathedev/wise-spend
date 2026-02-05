import mongoose, { Schema, Document } from "mongoose";

export type DailyAssessmentStatus = "completed" | "skipped";

export interface IDailyAssessmentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  status: DailyAssessmentStatus;
  score?: number; // 0-100 for completed
  createdAt: Date;
  updatedAt: Date;
}

const DailyAssessmentSchema = new Schema<IDailyAssessmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["completed", "skipped"],
      required: true,
    },
    score: { type: Number, required: false },
  },
  { timestamps: true }
);

DailyAssessmentSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyAssessmentModel = mongoose.model<IDailyAssessmentDocument>(
  "DailyAssessment",
  DailyAssessmentSchema
);
