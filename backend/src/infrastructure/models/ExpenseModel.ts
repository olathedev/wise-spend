import mongoose, { Schema, Document } from "mongoose";

export interface IExpenseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  title: string;
  aiDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    aiDescription: { type: String, required: true },
  },
  { timestamps: true },
);

export const ExpenseModel = mongoose.model<IExpenseDocument>(
  "Expense",
  ExpenseSchema,
);
