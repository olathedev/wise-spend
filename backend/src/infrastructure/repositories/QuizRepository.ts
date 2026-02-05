import { IQuizRepository } from "@domain/repositories/IQuizRepository";
import { Quiz } from "@domain/entities/Quiz";
import { QuizQuestion } from "@domain/entities/QuizQuestion";
import { QuizModel, IQuizDocument } from "@infrastructure/models/QuizModel";
import mongoose from "mongoose";

function toDomain(doc: IQuizDocument): Quiz {
  const questions = doc.questions.map(
    (q) =>
      new QuizQuestion(
        q.question,
        q.options,
        q.correctAnswer,
        q.explanation,
        q.concept,
      ),
  );

  return new Quiz(
    doc.userId.toString(),
    doc.title,
    doc.description,
    doc.concept,
    questions,
    doc.isCompleted,
    doc.completedAt,
    doc.score,
    doc.totalQuestions,
    doc.answeredCorrectly,
    doc._id.toString(),
    doc.createdAt,
    doc.updatedAt,
  );
}

export class QuizRepository implements IQuizRepository {
  async create(quiz: Quiz): Promise<Quiz> {
    const doc = new QuizModel({
      userId: new mongoose.Types.ObjectId(quiz.userId),
      title: quiz.title,
      description: quiz.description,
      concept: quiz.concept,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        concept: q.concept,
      })),
      isCompleted: quiz.isCompleted,
      completedAt: quiz.completedAt,
      score: quiz.score,
      totalQuestions: quiz.totalQuestions,
      answeredCorrectly: quiz.answeredCorrectly,
    });
    const saved = await doc.save();
    return toDomain(saved);
  }

  async findById(id: string): Promise<Quiz | null> {
    const doc = await QuizModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findAll(): Promise<Quiz[]> {
    const docs = await QuizModel.find().sort({ createdAt: -1 });
    return docs.map(toDomain);
  }

  async findByUserId(userId: string): Promise<Quiz[]> {
    const docs = await QuizModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    return docs.map(toDomain);
  }

  async findByUserIdAndCompleted(
    userId: string,
    completed: boolean,
  ): Promise<Quiz[]> {
    const docs = await QuizModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isCompleted: completed,
    }).sort({ createdAt: -1 });
    return docs.map(toDomain);
  }

  async update(id: string, entity: Partial<Quiz>): Promise<Quiz | null> {
    const updateData: any = {};
    if (entity.title !== undefined) updateData.title = entity.title;
    if (entity.description !== undefined)
      updateData.description = entity.description;
    if (entity.isCompleted !== undefined)
      updateData.isCompleted = entity.isCompleted;
    if (entity.completedAt !== undefined)
      updateData.completedAt = entity.completedAt;
    if (entity.score !== undefined) updateData.score = entity.score;
    if (entity.answeredCorrectly !== undefined)
      updateData.answeredCorrectly = entity.answeredCorrectly;

    const doc = await QuizModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return doc ? toDomain(doc) : null;
  }

  async markAsCompleted(
    quizId: string,
    score: number,
    answeredCorrectly: number,
  ): Promise<Quiz | null> {
    const doc = await QuizModel.findByIdAndUpdate(
      quizId,
      {
        isCompleted: true,
        completedAt: new Date(),
        score,
        answeredCorrectly,
      },
      { new: true },
    );
    return doc ? toDomain(doc) : null;
  }

  async countByUserId(userId: string): Promise<number> {
    return QuizModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await QuizModel.findByIdAndDelete(id);
    return !!result;
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    const result = await QuizModel.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result.deletedCount || 0;
  }
}
