import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode
    });
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    status: 500
  });
}
