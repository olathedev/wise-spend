import { APIKey } from "../entities/APIKey";

export interface IAPIKeyRepository {
  create(apiKey: APIKey): Promise<APIKey>;
  findById(id: string): Promise<APIKey | null>;
  findByUserId(userId: string): Promise<APIKey[]>;
  findBySecret(secret: string): Promise<APIKey | null>;
  update(id: string, apiKey: Partial<APIKey>): Promise<APIKey | null>;
  delete(id: string): Promise<boolean>;
  updateLastUsedAt(id: string): Promise<void>;
}
