import { OAuth2Client } from 'google-auth-library';
import { Logger } from '@shared/utils/logger';

export interface GoogleTokenPayload {
  sub: string; // Google ID
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      Logger.warn('GOOGLE_CLIENT_ID not set. Google authentication will not work.');
    }
    this.client = new OAuth2Client(clientId);
  }

  async verifyToken(idToken: string): Promise<GoogleTokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      if (!payload.email || !payload.name || !payload.sub) {
        throw new Error('Missing required user information');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified || false,
      };
    } catch (error) {
      Logger.error('Google token verification failed:', error);
      throw new Error('Invalid Google token');
    }
  }
}
