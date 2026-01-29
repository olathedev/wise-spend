export abstract class BaseEntity {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(id?: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
