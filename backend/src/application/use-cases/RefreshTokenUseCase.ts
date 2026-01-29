import { IUseCase } from '@application/interfaces/IUseCase';
import { JWTService } from '@infrastructure/services/JWTService';

export interface RefreshTokenRequest {
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export class RefreshTokenUseCase
  implements IUseCase<RefreshTokenRequest, RefreshTokenResponse>
{
  private jwtService: JWTService;

  constructor(jwtService?: JWTService) {
    this.jwtService = jwtService || new JWTService();
  }

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const newToken = this.jwtService.refreshToken(request.token);

    return {
      token: newToken,
    };
  }
}
