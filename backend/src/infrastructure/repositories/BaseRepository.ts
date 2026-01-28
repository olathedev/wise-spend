import { BaseEntity } from '@domain/entities/BaseEntity';
import { IBaseRepository } from '@domain/repositories/IBaseRepository';

export abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
  protected abstract getEntityName(): string;

  async findById(id: string): Promise<T | null> {
    // Implement your database logic here
    throw new Error(`findById not implemented for ${this.getEntityName()}`);
  }

  async findAll(): Promise<T[]> {
    // Implement your database logic here
    throw new Error(`findAll not implemented for ${this.getEntityName()}`);
  }

  async create(entity: T): Promise<T> {
    // Implement your database logic here
    throw new Error(`create not implemented for ${this.getEntityName()}`);
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    // Implement your database logic here
    throw new Error(`update not implemented for ${this.getEntityName()}`);
  }

  async delete(id: string): Promise<boolean> {
    // Implement your database logic here
    throw new Error(`delete not implemented for ${this.getEntityName()}`);
  }
}
