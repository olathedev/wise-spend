import { IRecurringBillRepository } from "@domain/repositories/IRecurringBillRepository";
import { RecurringBill } from "@domain/entities/RecurringBill";
import {
  RecurringBillModel,
  IRecurringBillDocument,
} from "@infrastructure/models/RecurringBillModel";
import mongoose from "mongoose";

function toDomain(doc: IRecurringBillDocument): RecurringBill {
  return new RecurringBill(
    doc.userId.toString(),
    doc.name,
    doc.amount,
    doc.dueDay,
    doc.frequency as "weekly" | "monthly" | "yearly",
    doc.nextDueDate,
    doc.isActive ?? true,
    doc._id.toString(),
    doc.createdAt,
    doc.updatedAt,
  );
}

export class RecurringBillRepository implements IRecurringBillRepository {
  async create(bill: RecurringBill): Promise<RecurringBill> {
    const doc = new RecurringBillModel({
      userId: new mongoose.Types.ObjectId(bill.userId),
      name: bill.name,
      amount: bill.amount,
      dueDay: bill.dueDay,
      frequency: bill.frequency,
      isActive: bill.isActive,
      nextDueDate: bill.nextDueDate,
    });
    const saved = await doc.save();
    return toDomain(saved);
  }

  async findById(id: string): Promise<RecurringBill | null> {
    const doc = await RecurringBillModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<RecurringBill[]> {
    const docs = await RecurringBillModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ nextDueDate: 1 });
    return docs.map(toDomain);
  }

  async findActiveByUserId(userId: string): Promise<RecurringBill[]> {
    const docs = await RecurringBillModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true,
    }).sort({ nextDueDate: 1 });
    return docs.map(toDomain);
  }

  async findDueBetween(userId: string, fromDate: Date, toDate: Date): Promise<RecurringBill[]> {
    const docs = await RecurringBillModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true,
      nextDueDate: { $gte: fromDate, $lte: toDate },
    }).sort({ nextDueDate: 1 });
    return docs.map(toDomain);
  }

  async update(id: string, updates: Partial<RecurringBill>): Promise<RecurringBill | null> {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.dueDay !== undefined) updateData.dueDay = updates.dueDay;
    if (updates.frequency !== undefined) updateData.frequency = updates.frequency;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.nextDueDate !== undefined) updateData.nextDueDate = updates.nextDueDate;

    const doc = await RecurringBillModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await RecurringBillModel.findByIdAndDelete(id);
    return !!result;
  }
}
