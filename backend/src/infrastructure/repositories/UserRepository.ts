import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { UserModel, IUserDocument } from "@infrastructure/models/UserModel";

export class UserRepository implements IUserRepository {
  private toDomain(document: IUserDocument): User {
    const user = new User(
      document.email,
      document.name,
      document.googleId,
      document.picture,
      document._id.toString(),
    );
    user.onboardingCompleted = document.onboardingCompleted ?? false;
    if (document.monthlyIncome != null) user.monthlyIncome = document.monthlyIncome;
    if (document.financialGoals != null) user.financialGoals = document.financialGoals;
    if (document.goalTargets != null) {
      // Convert Map to Record<string, number>
      const map = document.goalTargets as Map<string, number>;
      user.goalTargets = Object.fromEntries(map);
    }
    if (document.coachPersonality != null) user.coachPersonality = document.coachPersonality;
    if (document.wiseScore != null) user.wiseScore = document.wiseScore;
    if (document.wiseScoreUpdatedAt != null) user.wiseScoreUpdatedAt = document.wiseScoreUpdatedAt;
    if (document.wiseScoreTier != null) user.wiseScoreTier = document.wiseScoreTier;
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const document = await UserModel.findById(id);
    return document ? this.toDomain(document) : null;
  }

  async findAll(): Promise<User[]> {
    const documents = await UserModel.find({ isActive: true });
    return documents.map((doc) => this.toDomain(doc));
  }

  async create(entity: User): Promise<User> {
    const document = new UserModel({
      email: entity.email,
      name: entity.name,
      googleId: entity.googleId,
      picture: entity.picture,
      isActive: entity.isActive,
      onboardingCompleted: entity.onboardingCompleted,
      monthlyIncome: entity.monthlyIncome,
      financialGoals: entity.financialGoals,
      goalTargets: entity.goalTargets ? new Map(Object.entries(entity.goalTargets)) : undefined,
      coachPersonality: entity.coachPersonality,
      wiseScore: entity.wiseScore,
      wiseScoreUpdatedAt: entity.wiseScoreUpdatedAt,
      wiseScoreTier: entity.wiseScoreTier,
    });

    const saved = await document.save();
    return this.toDomain(saved);
  }

  async update(id: string, entity: Partial<User>): Promise<User | null> {
    const updateData: Record<string, unknown> = {
      ...entity,
      updatedAt: new Date(),
    };
    
    // Convert goalTargets Record to Map for MongoDB
    if (entity.goalTargets !== undefined) {
      updateData.goalTargets = entity.goalTargets
        ? new Map(Object.entries(entity.goalTargets))
        : undefined;
    }
    
    const document = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    return document ? this.toDomain(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel.findOne({ email: email.toLowerCase() });
    return document ? this.toDomain(document) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const document = await UserModel.findOne({ googleId });
    return document ? this.toDomain(document) : null;
  }

  async createOrUpdate(user: User): Promise<User> {
    const existing = await this.findByGoogleId(user.googleId);

    if (existing) {
      // Update existing user
      return (await this.update(existing.id!, {
        email: user.email,
        name: user.name,
        picture: user.picture,
        isActive: true,
      }))!;
    }

    // Check if email exists but googleId is different
    const emailUser = await this.findByEmail(user.email);
    if (emailUser) {
      // Update with new googleId
      return (await this.update(emailUser.id!, {
        googleId: user.googleId,
        name: user.name,
        picture: user.picture,
        isActive: true,
      }))!;
    }

    // Create new user
    return await this.create(user);
  }
}
