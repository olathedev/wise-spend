import mongoose, { Schema, Document } from "mongoose";

export interface IQuizQuestionDocument {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept?: string;
}

export interface IQuizDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  concept: string;
  questions: IQuizQuestionDocument[];
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
  totalQuestions: number;
  answeredCorrectly: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestionDocument>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  concept: { type: String, required: false },
});

const QuizSchema = new Schema<IQuizDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    concept: { type: String, required: true, index: true },
    questions: { type: [QuizQuestionSchema], required: true },
    isCompleted: { type: Boolean, default: false, index: true },
    completedAt: { type: Date, required: false },
    score: { type: Number, required: false, min: 0, max: 100 },
    totalQuestions: { type: Number, required: true, default: 0 },
    answeredCorrectly: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

// Compound index for efficient queries
QuizSchema.index({ userId: 1, isCompleted: 1 });
QuizSchema.index({ userId: 1, createdAt: -1 });

export const QuizModel = mongoose.model<IQuizDocument>("Quiz", QuizSchema);
