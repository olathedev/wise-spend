import { IAPIKeyRepository } from "@domain/repositories/IAPIKeyRepository";
import { APIKey } from "@domain/entities/APIKey";
import { APIKeyModel, IAPIKeyDocument } from "@infrastructure/models/APIKeyModel";
import mongoose from "mongoose";

function toDomain(doc: IAPIKeyDocument): APIKey {
  return new APIKey(
    doc.userId.toString(),
    doc.secret,
    doc.name || "Default API Key",
    doc.enabled ?? true,
    doc._id.toString(),
    doc.createdAt,
    doc.updatedAt,
  );
}

export class APIKeyRepository implements IAPIKeyRepository {
  async create(apiKey: APIKey): Promise<APIKey> {
    const doc = new APIKeyModel({
      userId: new mongoose.Types.ObjectId(apiKey.userId),
      secret: apiKey.secret,
      name: apiKey.name,
      enabled: apiKey.enabled,
      expiresAt: apiKey.expiresAt,
    });
    const saved = await doc.save();
    return toDomain(saved);
  }

  async findById(id: string): Promise<APIKey | null> {
    const doc = await APIKeyModel.findById(id);
    return doc ? toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<APIKey[]> {
    const docs = await APIKeyModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    return docs.map(toDomain);
  }

  async findBySecret(secret: string): Promise<APIKey | null> {
    const doc = await APIKeyModel.findOne({ secret });
    return doc ? toDomain(doc) : null;
  }

  async update(id: string, apiKey: Partial<APIKey>): Promise<APIKey | null> {
    const updateData: Record<string, unknown> = {
      ...apiKey,
      updatedAt: new Date(),
    };
    
    if (apiKey.userId) {
      updateData.userId = new mongoose.Types.ObjectId(apiKey.userId);
    }
    
    const doc = await APIKeyModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    return doc ? toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await APIKeyModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateLastUsedAt(id: string): Promise<void> {
    await APIKeyModel.findByIdAndUpdate(id, {
      lastUsedAt: new Date(),
    });
  }
}
