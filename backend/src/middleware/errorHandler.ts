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
    console.error(`❌ AppError [${err.statusCode}]:`, err.message);
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
      message: err.message,
      errors: (err as any).errors
    });
  }

  console.error('Erro inesperado:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    status: 500,
    message: err.message
  });
}
