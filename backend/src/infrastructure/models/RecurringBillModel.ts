import mongoose, { Schema, Document } from "mongoose";

export type BillFrequencyType = "weekly" | "monthly" | "yearly";

export interface IRecurringBillDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  dueDay: number;
  frequency: BillFrequencyType;
  isActive: boolean;
  nextDueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringBillSchema = new Schema<IRecurringBillDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    dueDay: { type: Number, required: true },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    nextDueDate: { type: Date, required: true },
  },
  { timestamps: true },
);

RecurringBillSchema.index({ userId: 1, isActive: 1 });

export const RecurringBillModel = mongoose.model<IRecurringBillDocument>(
  "RecurringBill",
  RecurringBillSchema,
);
