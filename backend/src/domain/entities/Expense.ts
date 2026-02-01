import { BaseEntity } from "./BaseEntity";

export class Expense extends BaseEntity {
  constructor(
    public userId: string,
    public imageUrl: string,
    public title: string,
    public aiDescription: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }
}
