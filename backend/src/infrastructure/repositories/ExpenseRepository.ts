import { IExpenseRepository } from "@domain/repositories/IExpenseRepository";
import { Expense } from "@domain/entities/Expense";
import { ExpenseModel, IExpenseDocument } from "@infrastructure/models/ExpenseModel";
import mongoose from "mongoose";

function toDomain(doc: IExpenseDocument): Expense {
  return new Expense(
    doc.userId.toString(),
    doc.imageUrl,
    doc.title,
    doc.aiDescription,
    doc._id.toString(),
    doc.createdAt,
    doc.updatedAt,
  );
}

export class ExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const doc = new ExpenseModel({
      userId: new mongoose.Types.ObjectId(expense.userId),
      imageUrl: expense.imageUrl,
      title: expense.title,
      aiDescription: expense.aiDescription,
    });
    const saved = await doc.save();
    return toDomain(saved);
  }

  async findById(id: string): Promise<Expense | null> {
    const doc = await ExpenseModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Expense[]> {
    const docs = await ExpenseModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    return docs.map(toDomain);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ExpenseModel.findByIdAndDelete(id);
    return !!result;
  }
}
