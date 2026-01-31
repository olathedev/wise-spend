import { Request, Response, NextFunction } from "express";
import { JWTService } from "@infrastructure/services/JWTService";
import { UnauthorizedError } from "@shared/errors/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);
    const jwtService = new JWTService();
    const payload = jwtService.verifyToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.message === "Token expired") {
      next(new UnauthorizedError("Token expired"));
    } else if (error instanceof Error && error.message === "Invalid token") {
      next(new UnauthorizedError("Invalid token"));
    } else {
      next(new UnauthorizedError("Authentication failed"));
    }
  }
};
