import jwt, { SignOptions } from 'jsonwebtoken';
import { Logger } from '@shared/utils/logger';

export interface JWTPayload {
  userId: string;
  email: string;
}

export class JWTService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || '';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!this.secret) {
      Logger.warn('JWT_SECRET not set. JWT generation will fail.');
    }
  }

  generateToken(payload: JWTPayload): string {
    if (!this.secret || this.secret.trim() === '') {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as SignOptions);
  }

  verifyToken(token: string): JWTPayload {
    if (!this.secret || this.secret.trim() === '') {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      const decoded = jwt.verify(token, this.secret as string) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  refreshToken(token: string): string {
    const payload = this.verifyToken(token);
    return this.generateToken(payload);
  }
}
