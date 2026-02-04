import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
  public email: string;
  public name: string;
  public picture?: string;
  public googleId: string;
  public isActive: boolean;
  public onboardingCompleted: boolean;
  /** Onboarding: approximate monthly net income */
  public monthlyIncome?: number;
  /** Onboarding: selected goal ids (e.g. emergency, debt, home) */
  public financialGoals?: string[];
  /** Goal targets: map of goalId -> targetAmount */
  public goalTargets?: Record<string, number>;
  /** Onboarding: coach persona id (e.g. drill_sergeant, cheerleader, analyst) */
  public coachPersonality?: string;
  /** AI-computed Wise Score 0–1000 (budget discipline, savings, goals). */
  public wiseScore?: number;
  public wiseScoreUpdatedAt?: Date;
  public wiseScoreTier?: string;

  constructor(
    email: string,
    name: string,
    googleId: string,
    picture?: string,
    id?: string,
  ) {
    super(id);
    this.email = email;
    this.name = name;
    this.googleId = googleId;
    this.picture = picture;
    this.isActive = true;
    this.onboardingCompleted = false;
  }
}
