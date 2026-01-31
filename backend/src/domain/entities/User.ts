import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
  public email: string;
  public name: string;
  public picture?: string;
  public googleId: string;
  public isActive: boolean;
  public onboardingCompleted: boolean;
  public onboardingData?: any;

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
