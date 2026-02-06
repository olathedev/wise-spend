import { ICommitmentRepository } from "@domain/repositories/ICommitmentRepository";
import { Commitment } from "@domain/entities/Commitment";
import { CommitmentModel, ICommitmentDocument } from "@infrastructure/models/CommitmentModel";
import { getWeekOf } from "@shared/utils/weekUtils";
import mongoose from "mongoose";

function toDomain(doc: ICommitmentDocument): Commitment {
  return new Commitment(
    doc.userId.toString(),
    doc.weekOf,
    doc.commitmentText,
    doc.status as "active" | "completed" | "abandoned",
    doc.aiObservations || [],
    doc.midWeekCheckInDate,
    doc.midWeekResponse,
    doc.midWeekReminderSentAt,
    doc.completionSelfReport,
    doc._id.toString(),
    doc.createdAt,
    doc.updatedAt,
  );
}

export class CommitmentRepository implements ICommitmentRepository {
  async create(commitment: Commitment): Promise<Commitment> {
    const doc = new CommitmentModel({
      userId: new mongoose.Types.ObjectId(commitment.userId),
      weekOf: commitment.weekOf,
      commitmentText: commitment.commitmentText,
      status: commitment.status,
      aiObservations: commitment.aiObservations || [],
      midWeekCheckInDate: commitment.midWeekCheckInDate,
      midWeekResponse: commitment.midWeekResponse,
      midWeekReminderSentAt: commitment.midWeekReminderSentAt,
      completionSelfReport: commitment.completionSelfReport,
    });
    const saved = await doc.save();
    return toDomain(saved);
  }

  async findById(id: string): Promise<Commitment | null> {
    const doc = await CommitmentModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findByUserIdAndWeek(userId: string, weekOf: string): Promise<Commitment | null> {
    const doc = await CommitmentModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      weekOf,
    });
    return doc ? toDomain(doc) : null;
  }

  async findActiveByUserId(userId: string): Promise<Commitment | null> {
    const currentWeek = getWeekOf(new Date());
    const doc = await CommitmentModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      status: "active",
      weekOf: currentWeek,
    });
    return doc ? toDomain(doc) : null;
  }

  async findLatestByUserId(userId: string): Promise<Commitment | null> {
    const doc = await CommitmentModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ weekOf: -1 });
    return doc ? toDomain(doc) : null;
  }

  async update(id: string, updates: Partial<Commitment>): Promise<Commitment | null> {
    const updateData: Record<string, unknown> = {};
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.midWeekCheckInDate !== undefined)
      updateData.midWeekCheckInDate = updates.midWeekCheckInDate;
    if (updates.midWeekResponse !== undefined)
      updateData.midWeekResponse = updates.midWeekResponse;
    if (updates.midWeekReminderSentAt !== undefined)
      updateData.midWeekReminderSentAt = updates.midWeekReminderSentAt;
    if (updates.completionSelfReport !== undefined)
      updateData.completionSelfReport = updates.completionSelfReport;
    if (updates.aiObservations !== undefined)
      updateData.aiObservations = updates.aiObservations;

    const doc = await CommitmentModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    return doc ? toDomain(doc) : null;
  }

  async addAiObservation(id: string, observation: string): Promise<Commitment | null> {
    const doc = await CommitmentModel.findByIdAndUpdate(
      id,
      { $push: { aiObservations: observation } },
      { new: true },
    );
    return doc ? toDomain(doc) : null;
  }

  /** Find active commitments that need mid-week reminder (no reminder sent yet, current week) */
  async findActiveForMidWeekReminder(): Promise<Commitment[]> {
    const currentWeek = getWeekOf(new Date());
    const docs = await CommitmentModel.find({
      status: "active",
      weekOf: currentWeek,
      $or: [{ midWeekReminderSentAt: { $exists: false } }, { midWeekReminderSentAt: null }],
    });
    return docs.map(toDomain);
  }
}
