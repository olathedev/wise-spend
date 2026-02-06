import { BaseEntity } from "./BaseEntity";

export type CommitmentStatus = "active" | "completed" | "abandoned";

export class Commitment extends BaseEntity {
  public userId: string;
  public weekOf: string; // YYYY-MM-DD (Sunday of week)
  public commitmentText: string;
  public status: CommitmentStatus;
  public midWeekCheckInDate?: Date;
  public midWeekResponse?: string;
  public midWeekReminderSentAt?: Date;
  public aiObservations: string[];
  public completionSelfReport?: string;

  constructor(
    userId: string,
    weekOf: string,
    commitmentText: string,
    status: CommitmentStatus = "active",
    aiObservations: string[] = [],
    midWeekCheckInDate?: Date,
    midWeekResponse?: string,
    midWeekReminderSentAt?: Date,
    completionSelfReport?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this.userId = userId;
    this.weekOf = weekOf;
    this.commitmentText = commitmentText;
    this.status = status;
    this.aiObservations = aiObservations;
    this.midWeekCheckInDate = midWeekCheckInDate;
    this.midWeekResponse = midWeekResponse;
    this.midWeekReminderSentAt = midWeekReminderSentAt;
    this.completionSelfReport = completionSelfReport;
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }
}
