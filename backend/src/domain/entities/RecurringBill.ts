import { BaseEntity } from "./BaseEntity";

export type BillFrequency = "weekly" | "monthly" | "yearly";

export class RecurringBill extends BaseEntity {
  public userId: string;
  public name: string;
  public amount: number;
  public dueDay: number; // 1-31 for monthly/yearly, 0-6 for weekly (day of week)
  public frequency: BillFrequency;
  public isActive: boolean;
  public nextDueDate: Date;

  constructor(
    userId: string,
    name: string,
    amount: number,
    dueDay: number,
    frequency: BillFrequency,
    nextDueDate: Date,
    isActive: boolean = true,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this.userId = userId;
    this.name = name;
    this.amount = amount;
    this.dueDay = dueDay;
    this.frequency = frequency;
    this.nextDueDate = nextDueDate;
    this.isActive = isActive;
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }
}
