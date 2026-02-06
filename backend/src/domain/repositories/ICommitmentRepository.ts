import { Commitment } from "@domain/entities/Commitment";

export interface ICommitmentRepository {
  create(commitment: Commitment): Promise<Commitment>;
  findById(id: string): Promise<Commitment | null>;
  findByUserIdAndWeek(userId: string, weekOf: string): Promise<Commitment | null>;
  findActiveByUserId(userId: string): Promise<Commitment | null>;
  findLatestByUserId(userId: string): Promise<Commitment | null>;
  update(id: string, updates: Partial<Commitment>): Promise<Commitment | null>;
  addAiObservation(id: string, observation: string): Promise<Commitment | null>;
  findActiveForMidWeekReminder(): Promise<Commitment[]>;
}
