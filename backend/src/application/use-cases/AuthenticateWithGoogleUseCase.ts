import { IUseCase } from '@application/interfaces/IUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';
import { GoogleAuthService } from '@infrastructure/services/GoogleAuthService';
import { JWTService } from '@infrastructure/services/JWTService';
import { UserRepository } from '@infrastructure/repositories/UserRepository';

export interface AuthenticateWithGoogleRequest {
  idToken: string;
}

export interface AuthenticateWithGoogleResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  token: string;
}

export class AuthenticateWithGoogleUseCase
  implements IUseCase<AuthenticateWithGoogleRequest, AuthenticateWithGoogleResponse>
{
  private userRepository: IUserRepository;
  private googleAuthService: GoogleAuthService;
  private jwtService: JWTService;

  constructor(
    userRepository?: IUserRepository,
    googleAuthService?: GoogleAuthService,
    jwtService?: JWTService
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.googleAuthService = googleAuthService || new GoogleAuthService();
    this.jwtService = jwtService || new JWTService();
  }

  async execute(
    request: AuthenticateWithGoogleRequest
  ): Promise<AuthenticateWithGoogleResponse> {
    // Verify Google token
    const googlePayload = await this.googleAuthService.verifyToken(request.idToken);

    // Create or update user
    const user = new User(
      googlePayload.email,
      googlePayload.name,
      googlePayload.sub,
      googlePayload.picture
    );

    const savedUser = await this.userRepository.createOrUpdate(user);

    // Generate JWT token
    const token = this.jwtService.generateToken({
      userId: savedUser.id!,
      email: savedUser.email,
    });

    return {
      user: {
        id: savedUser.id!,
        email: savedUser.email,
        name: savedUser.name,
        picture: savedUser.picture,
      },
      token,
    };
  }
}
