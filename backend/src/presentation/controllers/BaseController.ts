import { Request, Response, NextFunction } from 'express';
import { IUseCase } from '@application/interfaces/IUseCase';

export abstract class BaseController {
  protected async executeUseCase<TRequest, TResponse>(
    useCase: IUseCase<TRequest, TResponse>,
    request: TRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await useCase.execute(request);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
