import { IBaseRepository } from './IBaseRepository';
import { User } from '../entities/User';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  createOrUpdate(user: User): Promise<User>;
}
