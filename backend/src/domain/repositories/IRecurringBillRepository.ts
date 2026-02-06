import { RecurringBill } from "@domain/entities/RecurringBill";

export interface IRecurringBillRepository {
  create(bill: RecurringBill): Promise<RecurringBill>;
  findById(id: string): Promise<RecurringBill | null>;
  findByUserId(userId: string): Promise<RecurringBill[]>;
  findActiveByUserId(userId: string): Promise<RecurringBill[]>;
  findDueBetween(userId: string, fromDate: Date, toDate: Date): Promise<RecurringBill[]>;
  update(id: string, updates: Partial<RecurringBill>): Promise<RecurringBill | null>;
  delete(id: string): Promise<boolean>;
}
