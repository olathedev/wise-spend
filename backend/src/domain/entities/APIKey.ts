import { BaseEntity } from "./BaseEntity";

export class APIKey extends BaseEntity {
  public userId: string;
  public secret: string;
  public name: string;
  public enabled: boolean;
  public lastUsedAt?: Date;
  public expiresAt?: Date;

  constructor(
    userId: string,
    secret: string,
    name: string,
    enabled: boolean = true,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this.userId = userId;
    this.secret = secret;
    this.name = name;
    this.enabled = enabled;
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }

  public getBotID(): number {
    const BOT_ID_BASE = 20231226;
    if (!this.id) return 0;
    const idStr = this.id.toString();
    if (idStr.length >= 8) {
      const timestampHex = idStr.substring(0, 8);
      const timestampNum = parseInt(timestampHex, 16);
      const sequentialNum = timestampNum % 10000;
      return BOT_ID_BASE + sequentialNum;
    }
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = ((hash << 5) - hash) + idStr.charCodeAt(i);
      hash = hash & hash;
    }
    return BOT_ID_BASE + (Math.abs(hash) % 10000);
  }
  public getAPIKey(): string {
    return `${this.getBotID()}:${this.secret}`;
  }
}
