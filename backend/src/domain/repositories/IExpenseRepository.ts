import { Expense } from "@domain/entities/Expense";

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findByUserId(userId: string): Promise<Expense[]>;
  delete(id: string): Promise<boolean>;
}
